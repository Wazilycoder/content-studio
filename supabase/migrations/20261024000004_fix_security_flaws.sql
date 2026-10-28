-- ==============================================================================
-- CONTENT STUDIO — SECURITY HARDENING MIGRATION 4 (SEC-02, SEC-07)
-- Migration: 20261024000004_fix_security_flaws.sql
-- Description:
--   1. Fix SEC-02: Require authenticated owner or service_role; block anon bypass.
--   2. Fix SEC-07: Lock profiles row before idempotency check to serialize concurrent requests.
--   3. Explicitly revoke public/anon EXECUTE privileges.
-- ==============================================================================

-- 1. Thu hồi quyền từ anon và PUBLIC
REVOKE EXECUTE ON FUNCTION public.deduct_credit_atomic(UUID, TEXT) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_credit_atomic(UUID, TEXT) TO authenticated, service_role;

-- 2. Cập nhật định nghĩa hàm deduct_credit_atomic hoàn thiện
CREATE OR REPLACE FUNCTION public.deduct_credit_atomic(
  p_user_id UUID,
  p_request_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
  v_req_id TEXT;
  v_caller UUID;
BEGIN
  -- FIX SEC-02: Kiểm tra quyền nghiêm ngặt
  -- Nếu caller là NULL, bắt buộc role phải là service_role (backend trusted context)
  v_caller := auth.uid();
  IF v_caller IS NULL THEN
    IF auth.role() <> 'service_role' AND current_user <> 'service_role' THEN
      RAISE EXCEPTION 'Unauthorized: Anonymous calls are not allowed to deduct credits';
    END IF;
  ELSIF v_caller <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Caller (%) cannot deduct credits for user (%)', v_caller, p_user_id;
  END IF;

  -- Tạo request_id ngẫu nhiên nếu không truyền vào
  v_req_id := COALESCE(p_request_id, gen_random_uuid()::text);

  -- FIX SEC-07: Khóa dòng profile của người dùng trước để tuần tự hóa các request đồng thời
  SELECT credits_remaining INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- Kiểm tra idempotency sau khi đã giữ row lock
  IF p_request_id IS NOT NULL THEN
    SELECT balance_after INTO v_new_credits
    FROM public.credit_ledger
    WHERE user_id = p_user_id AND request_id = p_request_id AND operation = 'DEDUCT';

    IF FOUND THEN
      RETURN jsonb_build_object(
        'success', true,
        'credits_remaining', v_new_credits,
        'already_deducted', true
      );
    END IF;
  END IF;

  -- Nếu không tìm thấy profile (hiếm khi xảy ra do trigger đã tạo)
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, credits_remaining)
    VALUES (p_user_id, 9)
    RETURNING credits_remaining INTO v_new_credits;

    -- Ghi sổ cái
    INSERT INTO public.credit_ledger (user_id, request_id, operation, amount, balance_after)
    VALUES (p_user_id, v_req_id, 'DEDUCT', 1, v_new_credits);

    RETURN jsonb_build_object(
      'success', true,
      'credits_remaining', v_new_credits
    );
  END IF;

  -- Nếu hết credit
  IF v_current_credits < 1 THEN
    RETURN jsonb_build_object(
      'success', false,
      'credits_remaining', v_current_credits,
      'error', 'OUT_OF_CREDITS'
    );
  END IF;

  -- Trừ credit
  v_new_credits := v_current_credits - 1;
  UPDATE public.profiles
  SET credits_remaining = v_new_credits,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_user_id;

  -- Ghi nhận giao dịch vào ledger
  INSERT INTO public.credit_ledger (user_id, request_id, operation, amount, balance_after)
  VALUES (p_user_id, v_req_id, 'DEDUCT', 1, v_new_credits);

  RETURN jsonb_build_object(
    'success', true,
    'credits_remaining', v_new_credits
  );
END;
$$;

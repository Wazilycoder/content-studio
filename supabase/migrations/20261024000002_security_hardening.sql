-- ==============================================================================
-- CONTENT STUDIO — SECURITY HARDENING MIGRATION
-- Migration: 20261024000002_security_hardening.sql
-- ==============================================================================

-- 1. Chặn người dùng trực tiếp sửa cột credits_remaining từ Client
-- Thu hồi quyền UPDATE trên cột credits_remaining đối với role authenticated và anon
REVOKE UPDATE (credits_remaining) ON public.profiles FROM authenticated, anon;

-- Xóa policy cũ nếu còn lỏng lẻo và tạo policy chặt chẽ: chỉ cho phép sửa email nếu cần
DROP POLICY IF EXISTS "Users can update own non-sensitive profile" ON public.profiles;

-- Không cấp policy UPDATE cho client nếu không cần thiết; mọi thay đổi credit phải qua RPC SECURITY DEFINER


-- 2. Gia cố RPC deduct_credit_atomic: Kiểm tra quyền gọi & User Ownership
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
  -- Kiểm tra User Ownership: Người gọi chỉ được thao tác trên tài khoản của chính mình
  v_caller := auth.uid();
  IF v_caller IS NOT NULL AND v_caller <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Caller (%) cannot deduct credits for user (%)', v_caller, p_user_id;
  END IF;

  -- Tạo request_id ngẫu nhiên nếu không truyền vào
  v_req_id := COALESCE(p_request_id, gen_random_uuid()::text);

  -- Kiểm tra xem request_id này đã trừ chưa (Idempotency check)
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

  -- Khóa dòng profile để tránh xung đột đồng thời (Race condition)
  SELECT credits_remaining INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- Nếu không tìm thấy profile, tự động khởi tạo profile với 10 credits ban đầu (-1 = 9)
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


-- 3. Gia cố RPC refund_credit_atomic: Kiểm tra quyền gọi & User Ownership
CREATE OR REPLACE FUNCTION public.refund_credit_atomic(
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
  v_was_deducted BOOLEAN;
  v_caller UUID;
BEGIN
  -- Kiểm tra User Ownership: Người gọi chỉ được hoàn credit cho chính mình
  v_caller := auth.uid();
  IF v_caller IS NOT NULL AND v_caller <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Caller (%) cannot refund credits for user (%)', v_caller, p_user_id;
  END IF;

  v_req_id := COALESCE(p_request_id, gen_random_uuid()::text);

  -- Kiểm tra xem request_id này đã được hoàn trước đó chưa
  IF p_request_id IS NOT NULL THEN
    SELECT balance_after INTO v_new_credits
    FROM public.credit_ledger
    WHERE user_id = p_user_id AND request_id = p_request_id AND operation = 'REFUND';

    IF FOUND THEN
      RETURN jsonb_build_object(
        'success', true,
        'credits_remaining', v_new_credits,
        'already_refunded', true
      );
    END IF;

    -- Kiểm tra xem request này có từng bị trừ hay chưa
    SELECT EXISTS (
      SELECT 1 FROM public.credit_ledger
      WHERE user_id = p_user_id AND request_id = p_request_id AND operation = 'DEDUCT'
    ) INTO v_was_deducted;

    -- Nếu chưa từng bị trừ, không cho phép hoàn khống
    IF NOT v_was_deducted THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'REQUEST_NOT_DEDUCTED'
      );
    END IF;
  END IF;

  -- Khóa dòng profile để cập nhật
  SELECT credits_remaining INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'USER_NOT_FOUND');
  END IF;

  v_new_credits := v_current_credits + 1;
  UPDATE public.profiles
  SET credits_remaining = v_new_credits,
      updated_at = timezone('utc'::text, now())
  WHERE id = p_user_id;

  -- Ghi nhận giao dịch REFUND vào ledger
  INSERT INTO public.credit_ledger (user_id, request_id, operation, amount, balance_after)
  VALUES (p_user_id, v_req_id, 'REFUND', 1, v_new_credits);

  RETURN jsonb_build_object(
    'success', true,
    'credits_remaining', v_new_credits
  );
END;
$$;

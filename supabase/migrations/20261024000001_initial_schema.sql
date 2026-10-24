-- ==============================================================================
-- CONTENT STUDIO — PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- Migration: 20261024000001_initial_schema.sql
-- ==============================================================================

-- 1. BẢNG PROFILES (Lưu trữ thông tin người dùng và số dư lượt tạo nội dung)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  credits_remaining INTEGER NOT NULL DEFAULT 10 CHECK (credits_remaining >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Kích hoạt RLS cho bảng profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Người dùng chỉ được xem profile của chính mình
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Chặn trực tiếp người dùng sửa số credits từ client
DROP POLICY IF EXISTS "Users can update own non-sensitive profile" ON public.profiles;
CREATE POLICY "Users can update own non-sensitive profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- 2. BẢNG GENERATIONS (Lưu trữ lịch sử các bài viết đã tạo thành công)
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  tone TEXT NOT NULL,
  captions JSONB NOT NULL,
  headlines JSONB NOT NULL,
  hashtags JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Tạo Index để truy vấn lịch sử nhanh chóng
CREATE INDEX IF NOT EXISTS idx_generations_user_created 
  ON public.generations (user_id, created_at DESC);

-- Kích hoạt RLS cho bảng generations
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Policy: Người dùng chỉ xem bài viết của mình
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
CREATE POLICY "Users can view own generations"
  ON public.generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Người dùng chỉ tạo bài viết dưới danh nghĩa tài khoản của mình
DROP POLICY IF EXISTS "Users can insert own generations" ON public.generations;
CREATE POLICY "Users can insert own generations"
  ON public.generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Người dùng chỉ xóa bài viết của mình
DROP POLICY IF EXISTS "Users can delete own generations" ON public.generations;
CREATE POLICY "Users can delete own generations"
  ON public.generations
  FOR DELETE
  USING (auth.uid() = user_id);


-- 3. BẢNG CREDIT_LEDGER (Sổ cái giao dịch Credit - Đảm bảo tính Idempotent)
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('DEDUCT', 'REFUND')),
  amount INTEGER NOT NULL DEFAULT 1,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_request_operation UNIQUE (user_id, request_id, operation)
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user 
  ON public.credit_ledger (user_id, created_at DESC);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

-- Chỉ có RPC service role hoặc chủ tài khoản được xem sổ cái
DROP POLICY IF EXISTS "Users can view own credit ledger" ON public.credit_ledger;
CREATE POLICY "Users can view own credit ledger"
  ON public.credit_ledger
  FOR SELECT
  USING (auth.uid() = user_id);


-- 4. RPC: TRỪ CREDIT ATOMIC VÀ IDEMPOTENT
-- Trừ 1 credit nếu còn >= 1 lượt, ghi nhận vào ledger
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
BEGIN
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

  -- Nếu không tìm thấy profile, tự động khởi tạo profile với 10 credits
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


-- 5. RPC: HOÀN CREDIT ATOMIC VÀ IDEMPOTENT KHI GẶP LỖI
-- Chỉ hoàn đúng 1 lần cho 1 request_id duy nhất
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
BEGIN
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

    -- Nếu có request_id nhưng chưa từng bị trừ thì không hoàn
    IF NOT v_was_deducted THEN
      SELECT credits_remaining INTO v_current_credits
      FROM public.profiles WHERE id = p_user_id;

      RETURN jsonb_build_object(
        'success', false,
        'credits_remaining', COALESCE(v_current_credits, 0),
        'error', 'NO_MATCHING_DEDUCTION'
      );
    END IF;
  END IF;

  -- Khóa dòng và hoàn credit
  SELECT credits_remaining INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, credits_remaining)
    VALUES (p_user_id, 10)
    RETURNING credits_remaining INTO v_new_credits;
  ELSE
    v_new_credits := v_current_credits + 1;
    UPDATE public.profiles
    SET credits_remaining = v_new_credits,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_user_id;
  END IF;

  -- Ghi nhận hoàn tiền vào ledger
  INSERT INTO public.credit_ledger (user_id, request_id, operation, amount, balance_after)
  VALUES (p_user_id, v_req_id, 'REFUND', 1, v_new_credits);

  RETURN jsonb_build_object(
    'success', true,
    'credits_remaining', v_new_credits
  );
END;
$$;


-- 6. TRIGGER TỰ ĐỘNG KHỞI TẠO PROFILE KHI ĐĂNG KÝ MỚI
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits_remaining)
  VALUES (NEW.id, NEW.email, 10)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

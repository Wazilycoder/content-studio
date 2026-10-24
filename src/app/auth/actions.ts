"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email hoặc mật khẩu không chính xác." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Không thể đăng ký tài khoản. Vui lòng thử lại." };
  }

  // Nếu cấu hình Supabase yêu cầu xác nhận email (session trả về null):
  if (data.user && !data.session) {
    return {
      success: true,
      message: "Đăng ký thành công! Vui lòng kiểm tra hộp thư email để kích hoạt tài khoản.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits_remaining, email")
    .eq("id", user.id)
    .single();

  if (!profile || error) {
    // Tự động khởi tạo profile với 10 credits (Self-healing nếu trigger DB chưa chạy)
    const { data: newProfile } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email, credits_remaining: 10 })
      .select("credits_remaining")
      .single();

    return {
      id: user.id,
      email: user.email,
      credits: newProfile?.credits_remaining ?? 10,
    };
  }

  return {
    id: user.id,
    email: user.email,
    credits: profile.credits_remaining,
  };
}

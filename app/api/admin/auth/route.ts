import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { AdminAuthResponse } from "../types";

const registerSchema = z.object({
  email: z.string().email("Некорректный email"),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<AdminAuthResponse>> {
  try {
    const body = await request.json();

    const errors = registerSchema.safeParse(body);
    if (!errors.success) {
      return NextResponse.json(
        {
          success: false,
          message: errors.error?.message || "Некорректный email",
        },
        { status: 400 }
      );
    }

    const { email } = body;

    const adminSupabase = createAdminClient();

    const { data: existingUsers } = await adminSupabase.auth.admin.listUsers();
    const adminExists = existingUsers.users.find(
      (user) => user.user_metadata?.is_admin
    );

    if (adminExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Администратор уже зарегистрирован",
        },
        { status: 400 }
      );
    }

    const getRedirectUrl = () => {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_SITE_URL;
    };

    const siteUrl = getRedirectUrl();

    if (!siteUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Ошибка конфигурации сервера: не указан URL сайта",
        },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password: crypto.randomUUID(),
      options: {
        emailRedirectTo: `${siteUrl}/admin/callback`,
        data: {
          is_admin: true,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Ошибка при регистрации: " + error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ссылка для подтверждения отправлена на ваш email",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка сервера",
      },
      { status: 500 }
    );
  }
}

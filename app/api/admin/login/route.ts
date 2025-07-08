import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { AdminLoginResponse } from "../types";

const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
});

export async function POST(request: NextRequest): Promise<NextResponse<AdminLoginResponse>> {
  try {
    const body = await request.json();
    const { email } = loginSchema.parse(body);
    
    const adminSupabase = createAdminClient();
    
    // Проверяем, что пользователь существует и является админом
    const { data: existingUsers } = await adminSupabase.auth.admin.listUsers();
    const adminUser = existingUsers.users.find(user => 
      user.email === email && user.user_metadata?.is_admin
    );
    
    if (!adminUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Пользователь не найден или не является администратором" 
        },
        { status: 401 }
      );
    }
    
    // Получаем URL автоматически из Vercel
    const getRedirectUrl = () => {
      return process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000'
        : process.env.SITE_URL;
    };
    
    const siteUrl = getRedirectUrl();
    
    if (!siteUrl) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Ошибка конфигурации: не указан URL сайта" 
        },
        { status: 500 }
      );
    }
    
    // Используем обычный клиент для отправки Magic Link
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${siteUrl}/admin/callback`,
      },
    });
    
    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Ошибка при отправке ссылки: " + error.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Ссылка для входа отправлена на ваш email",
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Ошибка сервера" 
      },
      { status: 500 }
    );
  }
} 
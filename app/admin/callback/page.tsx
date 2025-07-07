"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageContainer } from "@/components/continer";
import { Loader2 } from "lucide-react";

export default function AdminCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Как работает Supabase Magic Link:
        // 1. Пользователь получает письмо с токеном
        // 2. Переходит по ссылке, которая ведет сюда (/admin/callback)
        // 3. Supabase автоматически обменивает токен из URL на сессию
        // 4. getSession() возвращает активную сессию, если токен валидный
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          router.push("/admin?error=auth_failed");
          return;
        }

        // Проверяем, что сессия создана и пользователь является администратором
        if (data.session?.user?.user_metadata?.is_admin) {
          // Успешная аутентификация - редиректим в панель
          router.push("/admin/dashboard");
        } else if (data.session?.user) {
          // Пользователь аутентифицирован, но не админ
          await supabase.auth.signOut(); // Выходим из неадминской сессии
          router.push("/admin?error=not_admin");
        } else {
          // Сессия не создана (невалидный токен или истекший)
          router.push("/admin?error=auth_failed");
        }
      } catch (error) {
        console.error("Callback error:", error);
        router.push("/admin?error=callback_failed");
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <PageContainer className="w-screen h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Выполняется вход...</p>
      </div>
    </PageContainer>
  );
} 
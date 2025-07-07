"use client";
import { PageContainer } from "@/components/continer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeading, Subtitle } from "@/components/ui/typography";
import { useState, useEffect, useCallback, Suspense } from "react";
import { Loader2, CheckCircle, UserPlus, Mail } from "lucide-react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export type TAdminData = {
  email: string;
};

const adminSchema = z.object({
  email: z.string().email("Некорректный email").min(1, "Email обязателен"),
});

const validateAdmin = (adminData: TAdminData) => {
  const result = adminSchema.safeParse(adminData);
  if (!result.success) {
    return result.error.flatten().fieldErrors;
  }
  return null;
};

function AdminPageContent() {
  const [adminData, setAdminData] = useState<TAdminData>({ email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof TAdminData, string[]>> | null>(null);
  const [isShowErrors, setIsShowErrors] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState<'loading' | 'register' | 'login'>('loading');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const checkAuthStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.user_metadata?.is_admin) {
        setIsAuthenticated(true);
        return;
      }

      const response = await fetch('/api/admin/check');
      const result = await response.json();
      
      if (result.success && result.hasAdmin) {
        setAuthStatus('login');
      } else {
        setAuthStatus('register');
      }
    } catch (error) {
      console.error('Ошибка проверки статуса:', error);
      setServerError('Ошибка соединения с сервером');
      setAuthStatus('register');
    }
  }, [supabase]);

  useEffect(() => {
    checkAuthStatus();
    
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'auth_failed':
          setServerError('Не удалось войти в систему');
          break;
        case 'not_admin':
          setServerError('У вас нет прав администратора');
          break;
        case 'callback_failed':
          setServerError('Ошибка при обработке ссылки');
          break;
      }
    }
  }, [searchParams, checkAuthStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const isCorrectValidated = (data: TAdminData) => {
    const validationErrors = validateAdmin(data);
    setErrors(validationErrors ?? null);
    return !validationErrors;
  };

  const handleFieldChange = (field: keyof TAdminData, value: string) => {
    const newAdminData = { ...adminData, [field]: value };
    setAdminData(newAdminData);
    
    if (isShowErrors) {
      const validationErrors = validateAdmin(newAdminData);
      setErrors(validationErrors ?? null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsShowErrors(true);
    setIsSubmitting(true);
    setServerError(null);

    if (isCorrectValidated(adminData)) {
      try {
        const endpoint = authStatus === 'register' ? '/api/admin/auth' : '/api/admin/login';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adminData),
        });

        const result = await response.json();

        if (result.success) {
          setIsSuccess(true);
          if (authStatus === 'login') {
            setMagicLinkSent(true);
          } else {
            // После регистрации переключаемся на логин
            setAuthStatus('login');
            setIsSuccess(false);
            setAdminData({ email: "" });
            setIsShowErrors(false);
          }
        } else {
          setServerError(result.message || "Произошла ошибка");
        }
      } catch (error) {
        console.error('Ошибка отправки:', error);
        setServerError("Упс, что-то пошло не так!");
      }
    }
    setIsSubmitting(false);
  };


  if (authStatus === 'loading') {
    return (
      <PageContainer className="w-screen h-screen flex flex-col items-center justify-center px-4">
        <Loader2 className="w-8 h-8 animate-spin" />
      </PageContainer>
    );
  }

  if (magicLinkSent) {
    return (
      <PageContainer className="w-screen h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-8">
            <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
            <SectionHeading className="mb-4">
              Проверьте вашу почту
            </SectionHeading>
            <Subtitle>
              Мы отправили ссылку для входа на {adminData.email}
            </Subtitle>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
              Перейдите по ссылке из письма для входа в систему управления
            </div>
            <Button
              onClick={() => setMagicLinkSent(false)}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Назад
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="w-screen h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center space-y-4 mb-8">
          <SectionHeading>
            {authStatus === 'register' ? 'Регистрация администратора' : 'Вход администратора'}
          </SectionHeading>
          <Subtitle>
            {authStatus === 'register' 
              ? 'Создайте учетную запись администратора'
              : 'Получите ссылку для входа на email'
            }
          </Subtitle>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/80 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email адрес
            </label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={adminData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className="w-full h-12 px-4 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl border-border"
              disabled={isSubmitting || isSuccess}
            />
            {isShowErrors && errors?.email && (
              <div className="text-sm text-destructive mt-1 px-1">
                {errors.email[0]}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground font-medium text-base shadow-lg hover:shadow-xl disabled:opacity-50 text-md font-semibold"
          >
            {isSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                {authStatus === 'register' ? 'Зарегистрирован' : 'Ссылка отправлена'}
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {authStatus === 'register' ? 'Регистрируем...' : 'Отправляем ссылку...'}
              </>
            ) : (
              <>
                {authStatus === 'register' ? (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Зарегистрировать
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Отправить ссылку
                  </>
                )}
              </>
            )}
          </Button>

          {isSuccess && !magicLinkSent && (
            <div className="text-sm text-primary text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              {authStatus === 'register' 
                ? 'Администратор зарегистрирован! Теперь вы можете войти в систему.' 
                : 'Ссылка для входа отправлена на ваш email!'
              }
            </div>
          )}

          {serverError && (
            <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              {serverError}
            </div>
          )}
        </form>
      </div>
    </PageContainer>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}

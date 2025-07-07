"use client";
import { TLeadData, validateLead, submitLeadData } from "@/app/api/leads/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2, Send, CheckCircle } from "lucide-react";

interface LeadRequestFormProps {
  className?: string;
  courseId?: number | null;
}

export const LeadRequestForm = ({ className, courseId = null }: LeadRequestFormProps) => {
  const initialLeadData: TLeadData = {
    name: "",
    phone: "",
    email: "",
    courseInterestedInId: courseId,
  };

  const [leadData, setLeadData] = useState<TLeadData>(initialLeadData);
  const [errors, setErrors] = useState<Partial<Record<keyof TLeadData, string[]>> | null>(null);
  const [isShowErrors, setIsShowErrors] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (data: TLeadData) => {
    const validationErrors = validateLead(data);
    setErrors(validationErrors ?? null);
    return !validationErrors;
  };



  const handleFieldChange = (field: keyof TLeadData, value: string) => {
    const newLeadData = { ...leadData, [field]: value };
    setLeadData(newLeadData);
    
    if (isShowErrors) {
      const validationErrors = validateLead(newLeadData);
      setErrors(validationErrors ?? null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsShowErrors(true);
    setIsSubmitting(true);
    setServerError(null);

    if (validateForm(leadData)) {
      try {
        const data = await submitLeadData(leadData);
        if (data.success) {
          setIsSuccess(true);
        } else {
          setServerError(data.clientErrorMessage);
        }
      } catch (error) {
        setServerError("Произошла ошибка при отправке заявки. Попробуйте еще раз.");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className={cn("w-full max-w-md mx-auto px-2", className)}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/80 space-y-6"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Ваше имя
            </label>
            <Input
              type="text"
              placeholder="Введите ваше имя"
              value={leadData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full h-12 px-4 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl border-border"
              disabled={isSubmitting || isSuccess}
            />
            {isShowErrors && errors?.name && (
              <div className="text-sm text-destructive mt-1 px-1">
                {errors.name[0]}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Номер телефона
            </label>
            <Input
              type="tel"
              placeholder="89999999999"
              value={leadData.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="w-full h-12 px-4 text-base focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl border-border"
              disabled={isSubmitting || isSuccess}
            />
            {isShowErrors && errors?.phone && (
              <div className="text-sm text-destructive mt-1 px-1">
                {errors.phone[0]}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email адрес
            </label>
            <Input
              type="email"
              placeholder="example@example.com"
              value={leadData.email}
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
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground font-medium text-base shadow-lg hover:shadow-xl disabled:opacity-50 text-md font-semibold"
        >
          {isSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Отправлено
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Отправляем...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Отправить заявку
            </>
          )}
        </Button>

        {isSuccess && (
          <div className="text-sm text-primary text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.
          </div>
        )}

        {serverError && (
          <div className="text-sm text-destructive text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            {serverError}
          </div>
        )}
      </form>
    </div>
  );
};

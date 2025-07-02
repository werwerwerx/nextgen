"use client";
import { RequestForm } from "./lead-request-form.component.ux";
import { leadFormShema, TLeadInfo, TPOSTLeadResponse } from "./shared";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ApiError, nextJsonApiInstance } from "@/lib/api.instance";
import { TFlatZodErrors, validate } from "@/lib/utils";

export const LeadRequestFormFeature = () => {
  return (
    <RequestForm
      mayInterestInList={["React", "Next.js", "Tailwind CSS", "TypeScript"]}
    />
  );
};

export const useLeadSubmit = (
  setErrorResponse: (error: string | null) => void,
  setValidationClientErrors: (errors: TFlatZodErrors<typeof leadFormShema> | null) => void
) => {
  
  const [component, setComponent] = useState<React.ReactNode | null>(null);

  const submitLead = async (leadData: TLeadInfo) => {
    try {
      setErrorResponse("");
      setValidationClientErrors(null);
      const validationErrors = validate(leadData, leadFormShema);
      if (validationErrors) {
        setValidationClientErrors(validationErrors);
        return;
      }

      
      const response = await nextJsonApiInstance<TPOSTLeadResponse>(
        "/api/leads",
        {
          method: "POST",
          body: JSON.stringify(leadData),
        }
      );

      console.log("API Response:", response);

      if (response.success) {
        setErrorResponse("Данные успешно отправлены!");
        setComponent(<RedirectSpinner interest={leadData.interest} />);
      } else {
        setErrorResponse(response.errorMessage || "Произошла ошибка при отправке данных");
        if (response.errors) {
          setValidationClientErrors(response.errors);
        }
        setComponent(null);
      }
    } catch (error) {
      setComponent(null);
      if (error instanceof ApiError) {
        setErrorResponse(error.message);
      } else {
        console.error("Submit error:", error);
        setErrorResponse("Произошла ошибка при отправке данных");
      }
    }
  };

  return [component, submitLead];
};

export const RedirectSpinner = ({ interest }: { interest?: string }) => {
  useEffect(() => {
    setTimeout(() => {
      const url = interest ? `/api/go?interest=${encodeURIComponent(interest)}` : "/api/go";
      window.location.href = url;
    }, 2000);
  }, [interest]);
  return (
    <div className="flex items-center absolute top-0 left-0 w-full h-full z-10 bg-background/50 justify-center gap-2 text-lg">
      <h1>Перенаправляем по партнёрской ссылке...</h1>
      <Loader2 className="animate-spin w-4 h-4 text-ellipsis" />
    </div>
  );
};

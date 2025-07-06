"use client";
import { leadFormShema, TLeadInfo, TPOSTLeadResponse } from "./shared";
import { useState } from "react";
import { ApiError, nextJsonApiInstance } from "@/lib/api.instance";
import { TFlatZodErrors, validate } from "@/lib/utils";


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
        setComponent(<ModalCongratulations />);
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

export const ModalCongratulations = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-background/90 backdrop-blur-lg flex items-center justify-center gap-3 text-lg font-medium z-50">


    </div>
  );
};

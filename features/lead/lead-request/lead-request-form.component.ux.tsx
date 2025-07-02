"use client";
import React, { useState, useTransition } from "react";
import { leadFormShema, TLeadInfo } from "./shared";
import { useLeadSubmit } from "./lead-request-form.feature";
import { TFlatZodErrors } from "@/lib/utils";
import { SPACING, LAYOUT, CARDS } from "@/components/main-page-ui/constants";
import {
  LeadFormTitle,
  LeadFormField,
  LeadFormSelect,
  LeadFormError,
  LeadFormButton,
  LeadFormContainer
} from "./lead-request-form.component.ui";

const initialFormValues: TLeadInfo = {
  name: "",
  email: "",
  phone: "",
  interest: "",
};

export const RequestForm = ({
  mayInterestInList,
}: {
  mayInterestInList: string[];
}) => {
  //state
  const [leadData, setLeadData] = useState<TLeadInfo>(initialFormValues);

  const [responseError, setResponseError] = useState<string | null>(null);
  const [leadDataValidationErrors, setLeadDataValidationErrors] =
    useState<TFlatZodErrors<typeof leadFormShema> | null>(null);

  const [isPending, startTransition] = useTransition();
  const [component, submitLead] = useLeadSubmit(
    (error) => {
      setResponseError(error);
    },
    (errors) => {
      setLeadDataValidationErrors(errors);
    }
  ) as [React.ReactNode | null, (leadData: TLeadInfo) => Promise<void>];

  //logic
  const handleSubmit = async (data: TLeadInfo) => {
    startTransition(async () => {
      await submitLead(data);
    });
  };

  if (component) {
    return component;
  }

  const updateLeadData = (InputValue: Partial<TLeadInfo>) => {
    setResponseError(null);
    setLeadDataValidationErrors(null);
    setLeadData((p) => ({ ...p, ...InputValue }));
  };

  //ui
  return (
    <LeadFormContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(leadData);
        }}
        className={`flex flex-col ${SPACING.gap}`}
      >
        <LeadFormField
          id="name"
          label="Имя"
          placeholder="Введите ваше имя"
          value={leadData.name}
          onChange={(e) => updateLeadData({ name: e.target.value })}
          error={leadDataValidationErrors?.name}
        />
        <LeadFormField
          id="email"
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={leadData.email || ""}
          onChange={(e) => updateLeadData({ email: e.target.value })}
          error={leadDataValidationErrors?.email}
        />
        <LeadFormField
          id="phone"
          label="Телефон"
          type="tel"
          placeholder="+7 (999) 123-45-67"
          value={leadData.phone || ""}
          onChange={(e) => updateLeadData({ phone: e.target.value })}
          error={leadDataValidationErrors?.phone}
        />
        <LeadFormSelect
          value={leadData.interest || ""}
          onChange={(value) => setLeadData((p) => ({ ...p, interest: value }))}
          options={mayInterestInList}
        />
        <LeadFormError error={responseError} />
        <LeadFormButton isPending={isPending} />
      </form>
    </LeadFormContainer>
  );
};

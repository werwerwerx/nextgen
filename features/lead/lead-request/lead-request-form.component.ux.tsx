"use client";
import React, { useState, useTransition } from "react";
import { leadFormShema, TLeadInfo } from "./shared";
import { useLeadSubmit } from "./use-lead-submit";
import { TFlatZodErrors } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SmallText,
  Subtitle,
  BodyText,
  SectionHeading,
  SubHeading,
} from "@/components/ui/typography";
import { CARDS, SPACING } from "@/components/main-page-ui/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


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
  const [leadData, setLeadData] = useState<TLeadInfo>(initialFormValues);
  const [consentChecked, setConsentChecked] = useState(false);
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

  const handleSubmit = async (data: TLeadInfo) => {
    if (!consentChecked) {
      setResponseError("Необходимо согласие на обработку персональных данных");
      return;
    }
    
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

  return (
    <Card
      className={`w-full bg-primary-foreground/10 backdrop-blur-lg border-primary-foreground/20 shadow-2xl pt-10`}
    >
      <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
        {responseError && (
          <div className="border border-red-500/50 bg-red-500/10 text-red-500 rounded-md p-4">
            <SmallText className="text-red-500">{responseError}</SmallText>
          </div>
        )}

        <div className="space-y-4 sm:space-y-5">
          <div className="flex flex-col items-start">
            <Label
              htmlFor="name"
              className="text-primary-foreground font-medium text-sm sm:text-base mb-2"
            >
              Как вас зовут?
            </Label>
            <Input
              id="name"
              value={leadData.name}
              onChange={(e) => updateLeadData({ name: e.target.value })}
              placeholder="Введите ваше имя"
              className={`bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/30 focus:border-primary-foreground/50 transition-all h-11 sm:h-12 text-sm sm:text-base ${
                leadDataValidationErrors?.name ? "border-red-500" : ""
              }`}
            />
            {leadDataValidationErrors?.name && (
              <SmallText className="text-red-500 mt-1">
                {leadDataValidationErrors.name}
              </SmallText>
            )}
          </div>

          <div className="flex flex-col items-start">
            <Label
              htmlFor="email"
              className="text-primary-foreground font-medium text-sm sm:text-base mb-2"
            >
              Ваш email
            </Label>
            <Input
              id="email"
              type="email"
              value={leadData.email}
              onChange={(e) => updateLeadData({ email: e.target.value })}
              placeholder="example@email.com"
              className={`bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/30 focus:border-primary-foreground/50 transition-all h-11 sm:h-12 text-sm sm:text-base ${
                leadDataValidationErrors?.email ? "border-red-500" : ""
              }`}
            />
            {leadDataValidationErrors?.email && (
              <SmallText className="text-red-500 mt-1">
                {leadDataValidationErrors.email}
              </SmallText>
            )}
          </div>

          <div className="flex flex-col items-start">
            <Label
              htmlFor="phone"
              className="text-primary-foreground font-medium text-sm sm:text-base mb-2"
            >
              Номер телефона
            </Label>
            <Input
              id="phone"
              type="tel"
              value={leadData.phone}
              onChange={(e) => updateLeadData({ phone: e.target.value })}
              placeholder="+7 (999) 123-45-67"
              className={`bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/30 focus:border-primary-foreground/50 transition-all h-11 sm:h-12 text-sm sm:text-base ${
                leadDataValidationErrors?.phone ? "border-red-500" : ""
              }`}
            />
            {leadDataValidationErrors?.phone && (
              <SmallText className="text-red-500 mt-1">
                {leadDataValidationErrors.phone}
              </SmallText>
            )}
          </div>

          {mayInterestInList && mayInterestInList.length > 0 && (
            <div className="flex flex-col items-start">
              <Label
                htmlFor="interest"
                className="text-primary-foreground font-medium text-sm sm:text-base mb-2"
              >
                Что вас интересует?
              </Label>
              <Select
                value={leadData.interest}
                onValueChange={(value) => updateLeadData({ interest: value })}
              >
                <SelectTrigger
                  className={`bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/30 focus:border-primary-foreground/50 hover:bg-primary-foreground/25 hover:border-primary-foreground/40 transition-all h-11 sm:h-12 text-sm sm:text-base rounded-md shadow-sm ${
                    leadDataValidationErrors?.interest ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue 
                    placeholder="Выберите направление" 
                    className="text-primary-foreground placeholder:text-primary-foreground/60"
                  />
                </SelectTrigger>
                <SelectContent className="bg-primary-foreground/95 backdrop-blur-lg border-primary-foreground/30 shadow-2xl rounded-lg">
                  {mayInterestInList.map((item) => (
                    <SelectItem 
                      key={item} 
                      value={item}
                      className="text-primary focus:bg-primary-foreground/20 focus:text-primary hover:bg-primary-foreground/15 cursor-pointer transition-colors"
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {leadDataValidationErrors?.interest && (
                <SmallText className="text-red-500 mt-1">
                  {leadDataValidationErrors.interest}
                </SmallText>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start space-x-3 sm:space-x-4">
          <Checkbox
            id="consent"
            checked={consentChecked}
            onCheckedChange={(checked) => {
              setConsentChecked(checked === true);
              setResponseError(null);
            }}
            className="border-primary-foreground/30 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-purple-600 mt-0.5 sm:mt-1 flex-shrink-0"
          />
          <Label
            htmlFor="consent"
            className="text-xs sm:text-sm text-primary-foreground/90 leading-relaxed cursor-pointer text-start"
          >
            Я согласен на обработку персональных данных и получение
            информационных материалов
          </Label>
        </div>

        <Button
          className={`w-full font-semibold py-2 sm:py-4 text-base sm:text-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 ${
            isPending || !consentChecked
              ? "bg-primary-foreground/50 text-primary/50 cursor-not-allowed"
              : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          }`}
          size="lg"
          disabled={isPending || !consentChecked}
          onClick={() => handleSubmit(leadData)}
        >
          {isPending ? "Отправка..." : "Получить доступ к курсам"}
        </Button>

        <p className="text-center text-primary-foreground/60 text-xs sm:text-sm leading-relaxed px-2">
          Нажимая кнопку, вы соглашаетесь с условиями использования
        </p>
      </CardContent>
    </Card>
  );
};

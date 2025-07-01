"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { leadFormShema, TLeadInfo } from "./shared";
import { useLeadSubmit } from "./lead-request-form.feature";
import { TFlatZodErrors } from "@/lib/utils";

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
    <Card className="w-full max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Начать обучение</CardTitle>
        <CardDescription>
          Получите доступ к курсам Neural University
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(leadData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              type="text"
              id="name"
              placeholder="Введите ваше имя"
              value={leadData.name}
              onChange={(e) => updateLeadData({ name: e.target.value })}
              className={leadDataValidationErrors?.name ? "border-red-500" : ""}
            />
            {leadDataValidationErrors?.name && (
              <p className="text-sm text-red-500">
                {leadDataValidationErrors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={leadData.email || ""}
              onChange={(e) => updateLeadData({ email: e.target.value })}
              className={
                leadDataValidationErrors?.email ? "border-red-500" : ""
              }
            />
            {leadDataValidationErrors?.email && (
              <p className="text-sm text-red-500">
                {leadDataValidationErrors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              type="tel"
              id="phone"
              placeholder="+7 (999) 123-45-67"
              value={leadData.phone || ""}
              onChange={(e) => updateLeadData({ phone: e.target.value })}
              className={
                leadDataValidationErrors?.phone ? "border-red-500" : ""
              }
            />
            {leadDataValidationErrors?.phone && (
              <p className="text-sm text-red-500">
                {leadDataValidationErrors.phone[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest">Интересует</Label>
            <Select
              value={leadData.interest || ""}
              onValueChange={(value) =>
                setLeadData((p) => ({ ...p, interest: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите интересующий вас курс" />
              </SelectTrigger>
              <SelectContent>
                {mayInterestInList.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {responseError && (
            <p className="text-sm text-red-500">{responseError}</p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Отправляем..." : "Получить доступ к курсам"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

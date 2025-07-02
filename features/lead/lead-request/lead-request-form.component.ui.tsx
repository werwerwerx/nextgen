"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SPACING } from "@/components/main-page-ui/constants";
import { MainHeading, Subtitle, SmallText, BodyText } from "@/components/ui/typography";


export function LeadFormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string[];
}) {
  return (
    <div className={`${SPACING.gap} flex flex-col`}>
      <Label htmlFor={id}><BodyText>{label}</BodyText></Label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500 w-full" : "w-full"}
        style={{ font: "inherit" }}
      />
      {error && <SmallText className="text-red-500">{error[0]}</SmallText>}
    </div>
  );
}

export function LeadFormSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className={`${SPACING.gap} flex flex-col`}>
      <Label htmlFor="interest"><BodyText>Интересует</BodyText></Label>
      <select
        id="interest"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full"
        style={{ font: "inherit" }}
      >
        <option value="" disabled>
          Выберите интересующий вас курс
        </option>
        {options.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

export function LeadFormError({ error }: { error?: string | null }) {
  if (!error) return null;
  return <SmallText className="text-red-500 text-center">{error}</SmallText>;
}

export function LeadFormButton({ isPending }: { isPending: boolean }) {
  return (
    <button type="submit" disabled={isPending} className={`w-full ${SPACING.gap} bg-primary text-primary-foreground font-semibold rounded-md py-2`}>
      <BodyText>{isPending ? "Отправляем..." : "Получить доступ к курсам"}</BodyText>
    </button>
  );
}

export function LeadFormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`w-full max-w-md mx-auto mt-10 bg-card rounded-2xl shadow-lg ${SPACING.padding} ${SPACING.gap}`}
    >
      {children}
    </div>
  );
}

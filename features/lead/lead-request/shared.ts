import React from "react";
import z from "zod";
import { type Database } from "@/lib/supabase/database.types";
import { type TNextApiGetResponse, type TNextApiPostResponse } from "@/lib/types/api";

export type TLeadFromDb = Database["public"]["Tables"]["leads"]["Row"]

export const leadFormShema = z.object({
  name: z.string().min(1, "Введите ваше имя"),
  email: z.string().email("Введите корректный email").optional().or(z.literal("")),
  phone: z.string().min(1, "Введите номер телефона").optional().or(z.literal("")),
  interest: z.string().min(1, "Выберите интересующий вас курс").optional().or(z.literal("")),
}).refine(
  (data) => data.email || data.phone,
  {
    message: "Введите email или номер телефона",
    path: ["email"],
  }
);

export type TLeadInfo = z.infer<typeof leadFormShema>;

export type TGETLeadResponse = TNextApiGetResponse<TLeadFromDb[] | null>
export type TPOSTLeadResponse = TNextApiPostResponse<typeof leadFormShema>



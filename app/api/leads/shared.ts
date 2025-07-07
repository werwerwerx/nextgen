import z from "zod";

export type TLeadData = {
  name: string;
  phone: string;
  email: string;
  courseInterestedInId: number | null;
};

const leadSchema = z.object({
  email: z.string().email("Некорректный email"),
  phone: z.string().min(10, "Некорректный номер телефона").max(15, "Некорректный номер телефона"),
  name: z.string().min(1, "Имя не может быть пустым"),
  courseInterestedInId: z.number().nullable().optional(),
});

export const validateLead = (leadData: TLeadData) => {
  const result = leadSchema.safeParse(leadData);
  if (!result.success) {
    return result.error.flatten().fieldErrors;
  }
  return null;
};
export const submitLeadData = async (
  leadData: TLeadData
): Promise<LeadResponse> => {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });
  return res.json() as Promise<LeadResponse>;
};

export type LeadResponse = {
  success: false;
  errorMessage: string;
  clientErrorMessage: string;
} | {
  success: true;
  data: any;
};


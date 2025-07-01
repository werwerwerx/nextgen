import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


export type TFlatZodErrors<T extends z.ZodSchema> = { [key in keyof z.infer<T>]: string[] | undefined }
  
export const validate = <T extends z.ZodSchema>(
  data: unknown, 
  schema: T
): undefined | TFlatZodErrors<T> => {
  const validated = schema.safeParse(data);
  if (validated.success) {
    return undefined;
  }
  return validated.error.flatten().fieldErrors as TFlatZodErrors<T>;
};

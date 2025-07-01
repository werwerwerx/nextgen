import { type ZodSchema } from "zod";
import { TFlatZodErrors } from "@/lib/utils";

export type TNextApiGetResponse<TData> = {
  success: true;
  successMessage?: string;
  data: TData;
} | {
  success: false;
  errorMessage: string;
}

export type TNextApiPostResponse<TValidationSchema extends ZodSchema = never> = {
  success: true;
  successMessage?: string;
} | {
  success: false;
  errorMessage: string;
  errors?: TValidationSchema extends never ? never : TFlatZodErrors<TValidationSchema>;
} 
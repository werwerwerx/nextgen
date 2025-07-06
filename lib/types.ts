import { Database } from "./supabase/database.types";

export type TRequest<T> = {
  success: true;
  data: T;
  error: null;
} | {
  success: false;
  error: Error;
  data: null;
}

export type DbCourse = Database['public']['Tables']['cources']['Row'];
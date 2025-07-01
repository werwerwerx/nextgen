export type TRequest<T> = {
  success: true;
  data: T;
  error: null;
} | {
  success: false;
  error: Error;
  data: null;
}
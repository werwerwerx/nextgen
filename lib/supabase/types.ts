export class SupabaseError extends Error {
  public error: Error;
  public clientMessage: string;

  constructor(message: string, error: Error, clientMessage: string) {
    super(message);
    this.name = "SupabaseError";
    this.error = error;
    this.clientMessage = clientMessage;
  }
}
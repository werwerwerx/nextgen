export class ApiError extends Error {

  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}
export const nextJsonApiInstance = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.errorMessage || data.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
}
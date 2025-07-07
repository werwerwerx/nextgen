// Типы для API администратора

export type AdminAuthResponse = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
  };
};

export type AdminLoginResponse = {
  success: boolean;
  message: string;
};

export type AdminCheckResponse = {
  success: boolean;
  hasAdmin: boolean;
  message?: string;
}; 
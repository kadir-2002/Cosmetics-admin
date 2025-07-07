import { apiCores } from "./apiCore";
import { apiCoreslogin } from "./apiCoreLogin";

export const loginApi = async (username: string, password: string) => {
  const response = await apiCoreslogin("/auth/login", { email: username, password: password, admin:"ADMIN" }, "POST");
  return response;
};
export const otpSendApi = async (username: string) => {
  const response = await apiCores("/user/reset-password/send-otp/", { email: username }, "POST");
  return response;
};
export const otpVerifyApi = async (username: string, otp: string) => {
  const response = await apiCores("/user/reset-password/verify-otp/", { email: username, otp: otp }, "POST");
  return response;
};

export const ResetPassWordApi = async (username: string, otp: string, password: string) => {
  const response = await apiCores("/user/reset-password/", { email: username, otp: otp, password: password, confirm_password: password }, "POST");
  return response;
};


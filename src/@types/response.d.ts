declare interface ErrorCommonResponse {
  success: boolean;
  message: string;
}
declare interface LoginResponse {
  access: string;
  access_expire: number;
  refresh_expire: number;
  name: string;
}

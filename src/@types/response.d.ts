declare interface ErrorCommonResponse {
  success: false;
  message: string;
}
declare interface LoginResponse {
  success: true;
  access: string;
  access_expire: number;
  refresh_expire: number;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly userId: string;
  readonly email: string;
  readonly fullName: string;
  readonly roles: readonly string[];
  readonly accessToken: string;
  readonly accessTokenExpiresOn: string;
  readonly refreshToken: string;
  readonly isDisabled: boolean;
  readonly isEmailConfirmed: boolean;
}

export interface RefreshTokenRequest {
  readonly refreshToken: string;
}

export interface RefreshTokenResponse {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly user?: UserProfile;
}

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: string;
  readonly tenantId: string;
  readonly avatarUrl?: string;
}

export interface ForgotPasswordRequest {
  readonly email: string;
}

export interface ResetPasswordRequest {
  readonly token: string;
  readonly password: string;
}

// Public barrel — everything outside the auth feature only imports from here.
export {
  useSession,
  useCurrentUser,
  useIsAuthenticated,
  useSignUp,
  useLogIn,
  useLogOut,
  useForgotPassword,
  useResetPassword,
  useUpdateProfile,
  useChangePassword,
} from "./hooks/useSession";
export { useAuthStore, selectAccessToken } from "./store/auth.store";
export { refreshSession, isSessionExpired } from "./application/refreshSession.usecase";
export {
  SignUpRequestSchema,
  SignUpFormSchema,
  LogInRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  UpdateProfileRequestSchema,
  ChangePasswordRequestSchema,
  PasswordSchema,
  SessionUserSchema,
  AuthSessionSchema,
} from "./contracts/auth.contract";
export type {
  AuthSession,
  SessionUser,
  SignUpRequest,
  SignUpFormValues,
  LogInRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "./contracts/auth.contract";

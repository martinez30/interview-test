import { createContext, ReactNode } from "react";
import { AuthService } from "@/services/AuthService";

import { AuthState, logout, setSessionToken } from "@/redux/slices/auth.slice"
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { toastr } from "@/utils/toastr";

export const AuthContext = createContext<CognitoContextType | null>(null);

export type AuthUser = {
  email?: string,
  name?: string,
  family_name?: string,
  given_name?: string,
  phone_number?: string,
  email_verified?: string,
  sub?: string,
};

const service = new AuthService();

function AuthProvider({ children }: { children: ReactNode }) {
  const state: AuthState = useAppSelector((selector) => selector.auth)
  const dispatch = useAppDispatch();

  async function signIn(email: string, password: string) {
    let response = await service.login(email, password)

    if (!response.isSuccess) {
      return { isError: true, message: response.errorMessage }
    }
    else {
      if (response.session) {
        dispatch(setSessionToken({ session: response.session, email, pass: password }))
        if (response.newPasswordRequired)
          return { isError: false, message: "New password required" }
      }

      return { isError: false }
    }
  }

  async function forceChangePassword(email: string, newPassword: string) {
    if (state.session) {
      await service.forceChangePassword(email, newPassword, state.session);
      await signIn(email, newPassword);
      return;
    }

    toastr({ title: "Erro", text: "Ocorreu um erro ao tentar cadastrar a nova senha", icon: "error" })
  }

  async function signOut() {
    dispatch(logout());
    try {
      // sign out here
    }
    catch (err) {
      // ignored
    }
  };

  async function resetPassword(email: string) {
    const message = await service.forgotPassword(email);
    toastr({ title: "Sucesso", text: message, icon: "success" })
  }

  async function confirmResetPassword(email: string, code: string, newPassword: string) {
    await service.confirmForgotPassword(email, code, newPassword);
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        roles: state.groups,
        signIn,
        signOut,
        forceChangePassword,
        resetPassword,
        confirmResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export type CognitoContextType = {
  user: AuthUser;
  roles: string[];
  signIn: (email: string, password: string) => Promise<unknown>;
  forceChangePassword: (email: string, newPassword: string) => Promise<unknown>;
  signOut: VoidFunction;
  resetPassword: (email: string) => Promise<unknown>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<unknown>;
};

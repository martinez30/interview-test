import { AuthUser } from "@/contexts/AuthContext";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: AuthUser;
  groups: string[],
  access_token?: string;
  refresh_token?: string;
  mfa_prefered?: string;
  session?: string;
  pass?: string;
  profile?: {
    name: string;
    active: boolean;
    email: string;
    phoneNumber: string;
    partnerId: string;
    tollOperatorId: string;
    businessGroupId: string;
    appMfaConfigured: boolean;
    emailMfaConfigured: boolean;
  }
}

const initialState: AuthState = { user: {}, groups: [], access_token: undefined, refresh_token: undefined, profile: undefined }

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.groups = action.payload.groups;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.mfa_prefered = action.payload.mfa_prefered;
      state.pass = undefined;
    },
    logout: (state) => {
      state.access_token = undefined;
      state.refresh_token = undefined;
      state.mfa_prefered = undefined;
      state.user = {};
      state.groups = [];
      state.profile = undefined;
      state.pass = undefined;
    },
    setSessionToken: (state, action: PayloadAction<{ session: string, email: string, pass: string }>) => {
      state.session = action.payload.session;
      state.pass = action.payload.pass;
      state.user = { email: action.payload.email };
    },
    clearSessionToken: (state) => {
      state.session = undefined;
      state.pass = undefined;
    },
    setMfaPrefered: (state, action: PayloadAction<string>) => {
      state.mfa_prefered = action.payload;
    },
    setProfile(state, action: PayloadAction<AuthState["profile"]>) {
      state.profile = action.payload;
    }
  }
});

export const { login, logout, setSessionToken, setProfile, setMfaPrefered, clearSessionToken } = authSlice.actions;
export default authSlice.reducer;

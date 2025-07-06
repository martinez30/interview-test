import { AuthState } from "@/redux/slices/auth.slice";
import { BaseService } from "@/services/BaseService";
import { AxiosResponse } from "axios";

export type LoginResponse = {
    accessToken: string,
    refreshToken: string,
    session?: string,
    isSuccess: boolean,
    newPasswordRequired: boolean,
    errorMessage?: string,
}

export class AuthService extends BaseService {
    constructor() {
        super("auth");
    }

    async disable(id: string) {
        await this._axios.patch(`${this._controller}/${id}/disable`);
    }

    async enable(id: string) {
        await this._axios.patch(`${this._controller}/${id}/enable`);
    }

    async resendConfirmationMail(email: string) {
        await this._axios.patch(`${this._controller}/resend-confirmation-mail`, { email });
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await this._axios.post(`${this._controller}/login`, { email, password });
        return response.data;
    }

    async refresh(email: string, refreshToken: string) {
        const response = await this._axios.post(`${this._controller}/refresh-token`, { email, refreshToken });
        return response.data;
    }

    async resetPassword(email: string, oldPassword: string) {
        const response = await this._axios.post(`${this._controller}/reset-password`, { email, oldPassword });
        return response.data;
    }

    async confirmResetPassword(email: string, newPassword: string, oldPassword: string, code: string, session: string) {
        await this._axios.post(`${this._controller}/confirm-reset-password`, { email, newPassword, oldPassword, code, session });
    }

    async forceChangePassword(email: string, newPassword: string, session: string) {
        await this._axios.post(`${this._controller}/force-change-password`, { email, newPassword, session });
    }

    async forgotPassword(email: string) {
        const response = await this._axios.post<string>(`${this._controller}/forgot-password`, { email });
        return response.data;
    }

    async confirmForgotPassword(email: string, code: string, newPassword: string) {
        await this._axios.patch(`${this._controller}/confirm-forgot-password`, { email, code, newPassword });
    }

    async updateProfile(user: any) {
        await this._axios.put(`${this._controller}/profile`, user);
    }

    async getProfile(): Promise<AxiosResponse<AuthState["profile"]>> {
        return await this._axios.get(`${this._controller}/profile`);
    }
}
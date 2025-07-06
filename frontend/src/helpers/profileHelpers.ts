import { ROLES } from "@/constants";
import useAuth from "@/hooks/useAuth";

export function isAdmin() {
    const { roles } = useAuth();
    return roles.some(role => [ROLES.ADMIN.toString()].includes(role));
}

export function isBackoffice() {
    const { roles } = useAuth();
    return roles.some(role => [
        ROLES.ADMIN.toString(),
    ].includes(role));
}
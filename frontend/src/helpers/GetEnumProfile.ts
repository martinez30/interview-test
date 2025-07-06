import { Roles } from "@/constants/Roles";

export const getEnumProfile = (enumName: string) => {
    switch (enumName) {
        case Roles.ADMINISTRATOR:
            return 1;
        default:
            return 0;
    }
}

export const getEnumProfileName = (profile: number) => {
    switch (profile) {
        case 1:
            return Roles.ADMINISTRATOR;
        default:
            return Roles.ADMINISTRATOR;
    }
}
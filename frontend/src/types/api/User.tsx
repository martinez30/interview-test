import { BaseEntity } from "@/types/api/BaseEntity";
import { UserProfile } from "./enums/UserProfile";
import { UserStatus } from "./enums/UserStatus";
import { EnumType } from "@/components/EnumCheckboxList";

export type User = {
    id?: string,
    name: string,

    email: string,
    emailVerified?: string,

    phoneNumber?: string
    phoneNumberVerified?: string

    profile?: {
        code: UserProfile,
        name: string,
        description: string,
        text: string
    };
    profileId?: UserProfile,
    status?: {
        code: UserStatus,
        name: string,
        description: string,
        text: string
    },
    active?: boolean,
    accessTo?: string,
    isBusinessGroupUser?: boolean,
    tollVoucherVendorId?: string,
    partnerId?: string,
    tollOperatorId?: string,
    businessGroupId?: string,
    availableApprovalProfiles: EnumType[]
    approvalProfiles?: EnumType[],

    appMfaConfigured: boolean,
    emailMfaConfigured: boolean
} & BaseEntity;


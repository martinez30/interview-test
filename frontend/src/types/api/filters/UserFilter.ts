import { BaseFilter } from "./BaseFilter";


export type UserFilter = BaseFilter & {
    profile: string;
    email: string;
    partnerId: string;
    tollOperatorId: string;
    businessGroupId: string;
};


import {BaseService} from "./BaseService";
import {PagedList} from "@/types/api/PagedList";
import {User} from "@/types/api/User";

export class UserService extends BaseService {
    constructor() {
        super("user");
    }

    async paged(params: any, pagination: any) {
        return await this.get<PagedList<User>>("", { ...params, ...pagination });
    }
}
import {BaseService} from "./BaseService";
import {PagedList} from "@/types/api/PagedList";
import {User} from "@/types/api/User";

class UserService extends BaseService {
    constructor() {
        super("user");
    }

    async paged(params: any, abortSignal?: AbortSignal) {
        return await this.get<PagedList<User>>("", { ...params }, abortSignal);
    }

    async getAll(params: any, abortSignal?: AbortSignal) {
        return await this.get<User[]>("", { ...params }, abortSignal);
    }
}

export default new UserService();
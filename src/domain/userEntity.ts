import {UserDBType, UserViewModel} from "../models/userModel";

export class UserEntity {
    constructor(private data: UserDBType) {}

    get id() { return this.data.id; }
    get login() { return this.data.login; }
    get email() { return this.data.email; }
    get createdAt() { return this.data.createdAt; }
    get emailConfirmation() { return this.data.emailConfirmation; }
    get password() { return this.data.password; }
    get passwordRecovery() { return this.data.passwordRecovery; }




    toViewModel():UserViewModel {
        return {
            id: this.data.id,
            login: this.data.login,
            email: this.data.email,
            createdAt: this.data.createdAt,
        };
    }

    toObject(): UserDBType {
        return { ...this.data };
    }
}

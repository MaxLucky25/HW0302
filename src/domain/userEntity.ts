import bcrypt from 'bcryptjs';
import {EmailConfirmationType, UserDBType} from "../models/userModel";

export class UserEntity {
    constructor(private data: UserDBType) {}

    get id() { return this.data.id; }
    get login() { return this.data.login; }
    get email() { return this.data.email; }
    get createdAt() { return this.data.createdAt; }
    get emailConfirmation() { return this.data.emailConfirmation; }
    get password() { return this.data.password; }

    isEmailConfirmed(): boolean {
        return this.data.emailConfirmation.isConfirmed;
    }

    checkConfirmationCode(code: string): boolean {
        return this.data.emailConfirmation.confirmationCode === code;
    }

    updateEmailConfirmation(update: Partial<EmailConfirmationType>) {
        this.data.emailConfirmation = {
            ...this.data.emailConfirmation,
            ...update
        };
    }

    async isPasswordCorrect(rawPassword: string): Promise<boolean> {
        return bcrypt.compare(rawPassword, this.data.password);
    }

    toObject(): UserDBType {
        return { ...this.data };
    }

    toViewModel() {
        return {
            id: this.data.id,
            login: this.data.login,
            email: this.data.email,
            createdAt: this.data.createdAt,
        };
    }
}

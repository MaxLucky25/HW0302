import { ObjectId } from "mongodb";
import { model, Schema, Document, Model } from "mongoose";
import { randomUUID } from "crypto";
import config from "../utility/config";
import {add} from "date-fns";

export type EmailConfirmationType = {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};

export type PasswordRecoveryType = {
    recoveryCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
};

export type UserDBType = {
    _id?: ObjectId;
    id: string;
    login: string;
    password: string;
    email: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
};

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
};

export type CreateUserDto = Pick<UserDBType, 'login' | 'password' | 'email'>;

interface IUserDocument extends Document {
    id: string;
    login: string;
    password: string;
    email: string;
    createdAt: Date;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
    toViewModel(): UserViewModel;
    resetPasswordRecovery(): void;
    resetEmailConfirmation(): void;
}

interface IUserModelStatic extends Model<IUserDocument> {
    createUser(data: {
        login: string;
        password: string;
        email: string;
        isConfirmed?: boolean;
    }): Promise<IUserDocument>;
}

const EmailConfirmationSchema = new Schema<EmailConfirmationType>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
}, { _id: false });

const PasswordRecoverySchema = new Schema<PasswordRecoveryType>({
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
}, { _id: false });

const UserSchema = new Schema<IUserDocument>({
    id: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    emailConfirmation: { type: EmailConfirmationSchema, required: true },
    passwordRecovery: { type: PasswordRecoverySchema, required: true },
});

UserSchema.methods.toViewModel = function (): UserViewModel {
    return {
        id: this.id,
        login: this.login,
        email: this.email,
        createdAt: this.createdAt
    };
};
UserSchema.methods.resetPasswordRecovery = function (): void {
    this.passwordRecovery = {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date(), { minutes: config.PASSWORD_RECOVERY_EXPIRATION_MINUTES }),
        isConfirmed: false
    };
};

UserSchema.methods.resetEmailConfirmation = function (): void {
    this.emailConfirmation = {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { minutes: config.EMAIL_CONFIRMATION_EXPIRATION_MINUTES }),
        isConfirmed: false
    };
};


UserSchema.statics.createUser = function ({login, password, email, isConfirmed = false
}): Promise<IUserDocument> {
    const user = new this({
        id: randomUUID(),
        login,
        email,
        password,
        createdAt: new Date(),
        emailConfirmation: {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), { minutes: config.EMAIL_CONFIRMATION_EXPIRATION_MINUTES }),
            isConfirmed
        },
        passwordRecovery: {
            recoveryCode: randomUUID(),
            expirationDate: add(new Date(), { minutes: config.PASSWORD_RECOVERY_EXPIRATION_MINUTES }),
            isConfirmed: false
        }
    });
    return user.save();
};

export const UserModel = model<IUserDocument, IUserModelStatic>('User', UserSchema);

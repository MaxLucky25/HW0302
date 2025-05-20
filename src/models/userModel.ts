import { ObjectId } from "mongodb";
import { model, Schema, Document, Model } from "mongoose";
import { randomUUID } from "crypto";

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
    createdAt: string;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
};

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
};

export type CreateUserDto = Pick<UserDBType, 'login' | 'password' | 'email'>;

interface IUserDocument extends Document {
    id: string;
    login: string;
    password: string;
    email: string;
    createdAt: string;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
    toViewModel(): UserViewModel;
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
    createdAt: { type: String, required: true },
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

UserSchema.statics.createUser = function ({login, password, email, isConfirmed = false
}): Promise<IUserDocument> {
    const user = new this({
        id: randomUUID(),
        login,
        email,
        password,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            confirmationCode: randomUUID(),
            expirationDate: new Date(new Date().getTime() + 3600 * 1000),
            isConfirmed
        },
        passwordRecovery: {
            recoveryCode: randomUUID(),
            expirationDate: new Date(),
            isConfirmed: false
        }
    });
    return user.save();
};

export const UserModel = model<IUserDocument, IUserModelStatic>('User', UserSchema);

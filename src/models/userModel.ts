import {ObjectId} from "mongodb";
import {model, Schema} from "mongoose";

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

export type UserViewModel ={
    id: string;
    login: string;
    email: string;
    createdAt: string;
}
export type CreateUserDto = Pick<UserDBType, 'login' | 'password' | 'email'>;

const EmailConfirmationSchema = new Schema({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
}, { _id: false });

const PasswordRecoverySchema = new Schema({
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
}, { _id: false });

const UserSchema = new Schema<UserDBType>({
    id: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: { type: EmailConfirmationSchema, required: true },
    passwordRecovery: { type: PasswordRecoverySchema, required: true },
});

export const UserModel = model<UserDBType>('User', UserSchema);
import {ObjectId} from "mongodb";

export type EmailConfirmationType = {
    confirmationCode: string;
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
};

export type UserViewModel =Omit<UserDBType, '_id' | 'password'>;
export type CreateUserDto = Pick<UserDBType, 'login' | 'password' | 'email'>;
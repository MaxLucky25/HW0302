import { Schema, model } from 'mongoose';
import {UserDBType} from "../models/userModel";


const EmailConfirmationSchema = new Schema({
    confirmationCode: { type: String, required: true },
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
});

export const UserModel = model<UserDBType>('User', UserSchema);

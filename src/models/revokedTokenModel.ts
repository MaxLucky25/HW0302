import {model, Schema} from "mongoose";

export type RevokedTokenDBType = {
    token: string;
    expiresAt: Date;
};

const RevokedTokenSchema = new Schema<RevokedTokenDBType>({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});

export const RevokedTokenModel = model<RevokedTokenDBType>("RevokedToken", RevokedTokenSchema);
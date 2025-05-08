import { Schema, model } from "mongoose";
import {RevokedTokenDBType} from "../models/revokedTokenModel";

const RevokedTokenSchema = new Schema<RevokedTokenDBType>({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
});

export const RevokedTokenModel = model<RevokedTokenDBType>("RevokedToken", RevokedTokenSchema);

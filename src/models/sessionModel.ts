import {model, Schema} from "mongoose";

export type SessionDBType = {
    userId: string;
    deviceId: string;
    ip: string;
    title: string; // user-agent
    lastActiveDate: string;
    expiresDate: string;
};

const SessionSchema = new Schema<SessionDBType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    expiresDate: { type: String, required: true },
});

export const SessionModel = model<SessionDBType>("Session", SessionSchema);


import { Schema, model } from 'mongoose';
import { SessionDBType } from '../models/sessionModel';

const SessionSchema = new Schema<SessionDBType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    expiresDate: { type: String, required: true },
});

export const SessionModel = model<SessionDBType>("Session", SessionSchema);

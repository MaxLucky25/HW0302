import { injectable } from "inversify";
import { SessionDBType } from "../models/sessionModel";
import {SessionModel} from "../infrastructure/sessionSchema";

@injectable()
export class SessionRepository  {
    async createSession(session: SessionDBType) {
        await SessionModel.create(session);
    }

        async updateLastActiveDate(
            deviceId: string,
            lastActiveDate: string,
            expiresDate: string,
            ip: string,
            title: string
        ) {
            const result = await SessionModel.updateOne(
                { deviceId },
                { $set: { lastActiveDate, expiresDate, ip, title } }
            );
        return result.modifiedCount === 1;
    }

    async deleteByDeviceId(deviceId: string) {
        return SessionModel.deleteOne({ deviceId });
    }

    async deleteAllExcept(deviceId: string, userId: string) {
        return SessionModel.deleteMany({ deviceId: { $ne: deviceId }, userId });
    }

    async findAllByUser(userId: string) {
        return SessionModel.find({ userId }).lean();
    }

    async findByDeviceId(deviceId: string) {
        return SessionModel.findOne({ deviceId }).lean();
    }
}

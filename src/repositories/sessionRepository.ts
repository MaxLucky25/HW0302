import { injectable } from "inversify";
import { SessionModel } from "../models/sessionModel";


@injectable()
export class SessionRepository  {
    async createLoginSession(userId: string, ip: string, title: string) {
        return await SessionModel.createLoginSession(userId, ip, title);
    }

    async updateSessionActivity(deviceId: string, ip: string, title: string) {
        return SessionModel.updateSessionActivity(deviceId, ip, title);
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

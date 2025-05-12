import { injectable } from 'inversify';
import { UserEntity } from '../domain/userEntity';
import { UserModel } from '../infrastructure/userSchema';
import {randomUUID} from "crypto";


@injectable()
export class UserRepository {

    async getById(id: string): Promise<UserEntity | null> {
        const doc = await UserModel.findOne({ id }).lean();
        return doc ? new UserEntity(doc) : null;
    }

    async getByLogin(login: string): Promise<UserEntity | null> {
        const doc = await UserModel.findOne({ login }).lean();
        return doc ? new UserEntity(doc) : null;
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        const doc = await UserModel.findOne({ email }).lean();
        return doc ? new UserEntity(doc) : null;
    }

    async getByLoginOrEmail(value: string): Promise<UserEntity | null> {
        return await this.getByLogin(value) ?? await this.getByEmail(value);
    }

    async doesExistByLoginOrEmail(login: string, email: string): Promise<boolean> {
        const count = await UserModel.countDocuments({ $or: [{ login }, { email }] });
        return count > 0;
    }

    async insert(user: UserEntity): Promise<void> {
        await new UserModel(user.toObject()).save();
    }

    async updateConfirmation(idOrEmail: string, update: any): Promise<boolean> {
        const result = await UserModel.updateOne(
            { $or: [{ id: idOrEmail }, { email: idOrEmail }] },
            { $set: { 'emailConfirmation': update } }
        );
        return result.modifiedCount === 1;
    }

    async findByConfirmationCode(code: string): Promise<UserEntity | null> {
        const doc = await UserModel.findOne({ 'emailConfirmation.confirmationCode': code }).lean();
        return doc ? new UserEntity(doc) : null;
    }

    async updateRecovery(userId: string, recovery: { recoveryCode: string, expirationDate: Date }): Promise<boolean> {
        const user = await UserModel.findById(userId);
        if (!user) return false;
        user.passwordRecovery = {
            ...recovery,
            isConfirmed: false
        };
        await user.save();
        return true;
    }

    async getByRecoveryCode(code: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ "passwordRecovery.recoveryCode": code }).lean();
        return user ? new UserEntity(user) : null;
    }

    async updatePassword(userId: string, newHashedPassword: string): Promise<boolean> {
        const user = await UserModel.findById(userId);
        if (!user) return false;
        user.password = newHashedPassword;
        user.passwordRecovery = {
            recoveryCode: randomUUID(),
            expirationDate: new Date(),
            isConfirmed: false
        };
        await user.save();
        return true;
    }


    async delete(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ id });
        return result.deletedCount === 1;
    }
}

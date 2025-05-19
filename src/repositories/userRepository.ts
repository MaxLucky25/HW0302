import {injectable} from 'inversify';
import { UserEntity } from '../domain/userEntity';
import {randomUUID} from "crypto";
import {CreateUserDto, UserModel} from "../models/userModel";
import bcrypt from "bcryptjs";


@injectable()
export class UserRepository {

    async doesExistByLoginOrEmail(login: string, email: string): Promise<boolean> {
        const count = await UserModel.countDocuments({ $or: [{ login }, { email }] });
        return count > 0;
    }

    async createUserByAdmin(dto: CreateUserDto) {
        const exists = await this.doesExistByLoginOrEmail(dto.login, dto.email);
        if (exists) return null;

        const newUser = new UserEntity({
            id: randomUUID(),
            login: dto.login,
            email: dto.email,
            password: await bcrypt.hash(dto.password, 10),
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: new Date(),
                isConfirmed: true,
            },
            passwordRecovery: {
                recoveryCode: randomUUID(),
                expirationDate: new Date(),
                isConfirmed: false
            }
        });

        await this.insert(newUser);
        return newUser.toViewModel();
    }

    async insert(user: UserEntity): Promise<void> {
        await new UserModel(user.toObject()).save();
    }

    async updateConfirmation(idOrEmail: string, update: any): Promise<boolean> {
        const user = await UserModel.findOne({ $or: [{ id: idOrEmail }, { email: idOrEmail }] });
        if (!user) return false;

        if (update.confirmationCode !== undefined) {
            user.emailConfirmation.confirmationCode = update.confirmationCode;
        }
        if (update.expirationDate !== undefined) {
            user.emailConfirmation.expirationDate = update.expirationDate;
        }
        if (update.isConfirmed !== undefined) {
            user.emailConfirmation.isConfirmed = update.isConfirmed;
        }

        await user.save();
        return true;
    }


    async updateRecovery(userId: string, recovery: { recoveryCode: string, expirationDate: Date }): Promise<boolean> {
        const user = await UserModel.findOne({id:userId});
        if (!user) return false;
        user.passwordRecovery = {
            ...recovery,
            isConfirmed: false
        };
        await user.save();
        return true;
    }


    async updatePassword(userId: string, newHashedPassword: string): Promise<boolean> {
        const user = await UserModel.findOne({id:userId});
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

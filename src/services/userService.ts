import {UserRepository} from '../repositories/userRepository';
import {UserQueryRepository} from '../repositories/userQueryRepository';
import {CreateUserDto, UserDBType} from '../models/userModel';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import {inject, injectable } from 'inversify';
import TYPES from '../di/types';

@injectable()
export class UserService  {
    constructor(
       @inject(TYPES.UserRepository)private userRepository: UserRepository,
       @inject(TYPES.UserQueryRepository)private userQueryRepository: UserQueryRepository,
    ) {}

    async getUsers(query: any) {
        return await this.userQueryRepository.getUsers(query);
    }

    async deleteUser(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    }

    async createUserByAdmin(input: CreateUserDto) {
        if (await this.userRepository.doesExistByLoginOrEmail(input.login, input.email)) {
            return null;
        }

        const user: UserDBType = {
            id: Date.now().toString(),
            login: input.login,
            email: input.email,
            password: await bcrypt.hash(input.password, 10),
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: new Date(),
                isConfirmed: true // Админ создает подтвержденного пользователя
            }
        };

        await this.userRepository.insert(user);
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    }
}
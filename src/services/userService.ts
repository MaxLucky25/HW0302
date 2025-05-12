import {UserRepository} from '../repositories/userRepository';
import {UserQueryRepository} from '../repositories/userQueryRepository';
import {CreateUserDto} from '../models/userModel';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import {inject, injectable } from 'inversify';
import TYPES from '../di/types';
import {UserEntity} from "../domain/userEntity";

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

    async createUserByAdmin(dto: CreateUserDto) {
        const exists = await this.userRepository.doesExistByLoginOrEmail(dto.login, dto.email);
        if (exists) return null;

        const newUser = new UserEntity({
            id: Date.now().toString(),
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

        await this.userRepository.insert(newUser);
        return newUser.toViewModel();
    }
}
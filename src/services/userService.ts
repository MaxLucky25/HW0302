import {UserRepository} from '../repositories/userRepository';
import {UserQueryRepository} from '../queryRepo/userQueryRepository';
import {CreateUserDto} from '../models/userModel';
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

    async createUserByAdmin(dto: CreateUserDto) {
        return await this.userRepository.createUserByAdmin(dto)
    }
}
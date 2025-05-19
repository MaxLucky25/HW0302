import {getUsersPaginationParams} from "../utility/userPagination";
import {injectable} from "inversify";
import {UserEntity} from "../domain/userEntity";
import {UserModel} from "../models/userModel";

@injectable()
export class UserQueryRepository  {
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
        const doc = await UserModel.findOne({
            $or: [{ login: value }, { email: value }]
        }).lean();
        return doc ? new UserEntity(doc) : null;
    }

    async findByConfirmationCode(code: string): Promise<UserEntity | null> {
        const doc = await UserModel.findOne({ 'emailConfirmation.confirmationCode': code }).lean();
        return doc ? new UserEntity(doc) : null;
    }

    async getByRecoveryCode(code: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ "passwordRecovery.recoveryCode": code }).lean();
        return user ? new UserEntity(user) : null;
    }


    async getUsers(query: any): Promise<any>{
        const {pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm} =
            getUsersPaginationParams(query);

    const filter: any = {};
    const orConditions: any[] = [];
        if (searchLoginTerm) {
            orConditions.push({ login: { $regex: searchLoginTerm, $options: "i" } });
        }
        if (searchEmailTerm) {
            orConditions.push({ email: { $regex: searchEmailTerm, $options: "i" } });
        }
        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }
        const totalCount = await UserModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const items = await UserModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items.map(({_id,password, ...rest}) => rest),
        };
    }
}
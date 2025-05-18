import {ObjectId} from "mongodb";

export type BlogDBType = {
    _id?: ObjectId;
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};
export type BlogViewModel = Omit<BlogDBType, '_id'>;
export type BlogDto = Pick<BlogDBType, 'name' | 'description' | 'websiteUrl'>;
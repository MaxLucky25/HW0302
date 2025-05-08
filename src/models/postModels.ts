import {ObjectId} from "mongodb";

export type PostDBType = {
    _id?: ObjectId;
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
};

export type PostViewModel =Omit<PostDBType, '_id'>;
export type CreatePostDto = Pick<PostDBType, 'title' | 'shortDescription' | 'content' | 'blogId'>;
export type UpdatePostDto = Pick<PostDBType, 'title' | 'shortDescription' | 'content' | 'blogId'>;
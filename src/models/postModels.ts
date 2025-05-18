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

export type PostDto ={
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type inputPostDto = {
    title: string;
    shortDescription: string;
    content: string;
}
import { ObjectId } from 'mongodb';
import {model, Schema} from "mongoose";

export type CommentDBType = {
    _id?: ObjectId;
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
    createdAt: Date;
};

export type CommentViewModel = Omit<CommentDBType, '_id' | 'postId'>;

export type CommentDto = {
    content: string;
};

const commentSchema = new Schema<CommentDBType>({
    id: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

export const CommentModel = model<CommentDBType>('Comment', commentSchema);

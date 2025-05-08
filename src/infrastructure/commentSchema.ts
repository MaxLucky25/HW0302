import { Schema, model } from 'mongoose';
import {CommentDBType} from "../models/commentModels";

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

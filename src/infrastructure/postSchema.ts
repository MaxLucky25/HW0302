import { Schema, model } from 'mongoose';
import {PostDBType} from "../models/postModels";

export const PostSchema = new Schema<PostDBType>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

export const PostModel = model<PostDBType>('Post', PostSchema);
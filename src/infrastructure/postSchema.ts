import { Schema, model } from 'mongoose';
import {PostDBType, PostViewModel} from "../models/postModels";


export interface PostDocument extends Document, PostDBType {
    toViewModel(): PostViewModel;
}

const PostSchema = new Schema<PostDocument>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

PostSchema.methods.toViewModel = function () :PostViewModel {
    return {
        id:this.id,
        title: this.title,
        shortDescription: this.shortDescription,
        content: this.content,
        blogId: this.blogId,
        blogName:this.blogName,
        createdAt: this.createdAt,
    }
}

export const PostModel = model<PostDocument>('Post', PostSchema);


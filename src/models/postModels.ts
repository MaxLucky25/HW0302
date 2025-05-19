import {ObjectId} from "mongodb";
import {model, Schema} from "mongoose";

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


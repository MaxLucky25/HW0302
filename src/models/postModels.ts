import {ObjectId} from "mongodb";
import {Model, model, Schema} from "mongoose";
import {randomUUID} from "crypto";

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

interface IPostDocument extends Document, PostDBType {
    toViewModel(): PostViewModel;
}

interface IPostModelStatic extends Model<IPostDocument> {
    createPost(data:{
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        blogName: string;
    }): Promise<IPostDocument>;
}


const PostSchema = new Schema<IPostDocument>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
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
    };
};

PostSchema.statics.createPost = function
({title, shortDescription, content, blogId, blogName})
    :Promise<IPostDocument> {
    const post = new this({
        id: randomUUID(),
        title,
        shortDescription,
        content,
        blogId,
        blogName,
        createdAt: new Date(),
    });
    return post.save();
}

export const PostModel = model<IPostDocument, IPostModelStatic>('Post', PostSchema);


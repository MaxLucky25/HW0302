import {model, Schema} from "mongoose";
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

export interface BlogDocument extends Document, BlogDBType {
    toViewModel(): BlogViewModel;
}

const BlogSchema = new Schema<BlogDocument>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, required: true },
    isMembership: { type: Boolean, required: true },
});

BlogSchema.methods.toViewModel = function (): BlogViewModel {
    return {
        id: this.id,
        name: this.name,
        description: this.description,
        websiteUrl: this.websiteUrl,
        createdAt: this.createdAt,
        isMembership: this.isMembership,
    };
};

export const BlogModel = model<BlogDocument>('Blog', BlogSchema);
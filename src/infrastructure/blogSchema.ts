import {model, Schema} from "mongoose";
import { BlogDBType } from "../models/blogModels";


const BlogSchema = new Schema<BlogDBType>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, required: true },
    isMembership: { type: Boolean, required: true },
});

export const BlogModel = model<BlogDBType>('Blog', BlogSchema);
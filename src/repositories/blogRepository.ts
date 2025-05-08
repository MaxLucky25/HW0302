import { BlogDBType, CreateBlogDto, UpdateBlogDto, BlogViewModel } from '../models/blogModels';
import {injectable} from "inversify";
import {BlogModel} from "../infrastructure/blogSchema";

@injectable()
export class BlogRepository  {

    async getById(id: string): Promise<BlogViewModel | null> {
        const blog = await BlogModel.findOne({id:id},{_id: 0}).lean();
        return blog ?? null;
    }

    async create(input: CreateBlogDto): Promise<BlogViewModel> {
        const newBlog: BlogDBType = {
            id: Date.now().toString(),
            ...input,
            createdAt: new Date(),
            isMembership: false,
        };

        await BlogModel.create(newBlog);
        return newBlog;

    }

    async update(id: string, input: UpdateBlogDto): Promise<boolean> {
       const result = await BlogModel.updateOne(
           {id:id},
           { $set: { ...input } }
       );
       return result.matchedCount === 1;
    }

    async delete(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({id:id});
        return result.deletedCount === 1;
    }

}
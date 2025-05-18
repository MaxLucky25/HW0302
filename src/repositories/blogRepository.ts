import {BlogDto, BlogViewModel} from '../models/blogModels';
import {injectable} from "inversify";
import {BlogModel} from "../infrastructure/blogSchema";

@injectable()
export class BlogRepository  {

    async create(input: BlogDto): Promise<BlogViewModel> {
        const newBlog = new BlogModel({
            id: Date.now().toString(),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: new Date(),
            isMembership: false,
        });

        await newBlog.save();
        return newBlog.toViewModel();

    }

    async update(id: string, input: BlogDto): Promise<boolean> {
        const blog = await BlogModel.findOne({ id });
        if (!blog) return false;

        blog.name = input.name;
        blog.description = input.description;
        blog.websiteUrl = input.websiteUrl;

        await blog.save();
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({id});
        return result.deletedCount === 1;
    }

}
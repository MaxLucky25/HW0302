import {PostDto, PostModel, PostViewModel} from '../models/postModels';
import {injectable} from "inversify";
import {BlogModel} from "../models/blogModel";

@injectable()
export class PostRepository {
    async getById(id: string): Promise<PostViewModel | null> {
        const post = await PostModel.findOne({id});
        return post ? post.toViewModel() : null;
    }
    async create(input:PostDto): Promise<PostViewModel | null> {
        const blog = await BlogModel.findOne({id:input.blogId});
        if (!blog) return null;

        const newPost = await PostModel.createPost ({
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: blog.name,
        });

        return newPost.toViewModel();
    }

    async update(id: string, input:PostDto): Promise<boolean> {
        const post = await PostModel.findOne({id});
        if (!post) return false;
        const blog = await BlogModel.findOne({id:input.blogId});
        if (!blog) return false;

        post.title = input.title;
        post.shortDescription = input.shortDescription;
        post.content = input.content;
        post.blogId = input.blogId;
        post.blogName = blog.name;

        await post.save();
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({id});
        return result.deletedCount === 1;
    }
}
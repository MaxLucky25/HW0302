import {PostDto, PostModel, PostViewModel} from '../models/postModels';
import {inject, injectable} from "inversify";
import TYPES from '../di/types';
import {BlogQueryRepository} from "../queryRepo/blogQueryRepository";

@injectable()
export class PostRepository {
    constructor(
       @inject(TYPES.BlogQueryRepository)private blogQueryRepository: BlogQueryRepository
    ) {}

    async create(input:PostDto): Promise<PostViewModel | null> {
        const blog = await this.blogQueryRepository.getById(input.blogId);
        if (!blog) return null;

        const newPost = new PostModel({
            id: Date.now().toString(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: blog.name,
            createdAt: new Date()
        });

        await newPost.save();
        return newPost.toViewModel();
    }

    async update(id: string, input:PostDto): Promise<boolean> {
        const post = await PostModel.findOne({id});
        if (!post) return false;
        const blog = await this.blogQueryRepository.getById(input.blogId);
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
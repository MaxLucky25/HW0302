import { PostDBType, CreatePostDto, UpdatePostDto, PostViewModel } from '../models/postModels';
import {BlogRepository} from './blogRepository';
import {inject, injectable} from "inversify";
import TYPES from '../di/types';
import {PostModel} from "../infrastructure/postSchema";

@injectable()
export class PostRepository {
    constructor(
       @inject(TYPES.BlogRepository)private blogRepository: BlogRepository
    ) {}

    async getById(id: string): Promise<PostViewModel | null> {
        return PostModel.findOne({id:id},{_id: 0}).lean();
    }

    async create(input:  CreatePostDto): Promise<PostViewModel | null> {
        const blog = await this.blogRepository.getById(input.blogId);
        if (!blog) return null;

        const newPost: PostDBType = {
            id: Date.now().toString(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: blog.name,
            createdAt: new Date()
        };

        await PostModel.create(newPost);
        return newPost;
    }

    async update(id: string, input: UpdatePostDto): Promise<boolean> {
        const blog = await this.blogRepository.getById(input.blogId);
        if (!blog) return false;

        const result = await  PostModel.updateOne(
            {id: id},
            {
                $set: {
                    title: input.title,
                    shortDescription: input.shortDescription,
                    content: input.content,
                    blogId: input.blogId,
                    blogName: blog.name,
                }
            }
        );
        return result.matchedCount === 1;
    }

    async delete(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
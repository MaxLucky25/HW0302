import {BlogQueryRepository} from "../repositories/blogQueryRepository";
import {BlogRepository} from "../repositories/blogRepository";
import {CreateBlogDto, UpdateBlogDto} from "../models/blogModels";
import {PostQueryRepository} from "../repositories/postQueryRepository";
import {CreatePostDto} from "../models/postModels";
import {PostRepository} from "../repositories/postRepository";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";

@injectable()
export class BlogService  {
    constructor(
        @inject(TYPES.BlogRepository) private blogRepository: BlogRepository,
        @inject(TYPES.BlogQueryRepository) private blogQueryRepository: BlogQueryRepository,
        @inject(TYPES.PostRepository) private postRepository: PostRepository,
        @inject(TYPES.PostQueryRepository) private postQueryRepository: PostQueryRepository,
    ) {}

    async getAllBlogs(query: any) {
        return await this.blogQueryRepository.getBlogs(query);
    }

    async getBlogBYId(id: string) {
        return await this.blogRepository.getById(id);
    }

    async createBlog(input: CreateBlogDto){
        return await this.blogRepository.create(input);
    }

    async updateBlog(id: string, input: UpdateBlogDto){
        return await this.blogRepository.update(id, input);
    }

    async deleteBlog(id: string){
        return await this.blogRepository.delete(id);
    }

    async getPostsForBlog(blogId: string, query: any){
        return await this.postQueryRepository.getPostsByBlogId(blogId,query);
    }

    async createPostsForBlog(blogId: string, input: Omit<CreatePostDto, 'blogId'>){
        const postInput: CreatePostDto = {...input,blogId};
        return await this.postRepository.create(postInput);
    }
}
import {BlogRepository} from "../repositories/blogRepository";
import {inputPostDto, PostDto} from "../models/postModels";
import {PostRepository} from "../repositories/postRepository";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {BlogDto} from "../models/blogModel";


@injectable()
export class BlogService  {
    constructor(
        @inject(TYPES.BlogRepository) private blogRepository: BlogRepository,
        @inject(TYPES.PostRepository) private postRepository: PostRepository,
    ) {}


    async createBlog(input: BlogDto){
        return await this.blogRepository.create(input);
    }

    async updateBlog(id: string, input: BlogDto){
        return await this.blogRepository.update(id, input);
    }

    async deleteBlog(id: string){
        return await this.blogRepository.delete(id);
    }

    async createPostsForBlog(
        blogId: string, input: inputPostDto){
        const postInput: PostDto = {...input,blogId};
        return await this.postRepository.create(postInput);
    }
}
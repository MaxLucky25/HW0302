import {PostQueryRepository} from "../repositories/postQueryRepository";
import {PostRepository} from "../repositories/postRepository";
import {CreatePostDto, UpdatePostDto} from "../models/postModels";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";

@injectable()
export class PostService {
    constructor(
        @inject(TYPES.PostRepository) private postRepository: PostRepository,
        @inject(TYPES.PostQueryRepository) private postQueryRepository: PostQueryRepository
    ) {}

    async getAllPosts(query: any) {
        return await this.postQueryRepository.getPosts(query);
    }

    async getPostById(id: string) {
        return await this.postRepository.getById(id);
    }

    async createPost(input: CreatePostDto) {
        return await this.postRepository.create(input);
    }

    async updatePost(id:string, input: UpdatePostDto) {
        return await this.postRepository.update(id, input);
    }

    async deletePost(id:string) {
        return await this.postRepository.delete(id);
    }
}
import {CommentRepository} from "../repositories/commentRepository";
import {CommentViewModel, CreateCommentDto, UpdateCommentDto} from "../models/commentModels";
import {PostRepository} from "../repositories/postRepository";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";

@injectable()
export class CommentService  {
    constructor(
        @inject(TYPES.CommentRepository) private commentRepository: CommentRepository,
        @inject(TYPES.PostRepository) private postRepository: PostRepository,
    ) {
    }

    async createComment(postId: string, input: CreateCommentDto, commentatorInfo: {
        userId: string;
        userLogin: string
    }): Promise<CommentViewModel | null> {
        // Проверяем существование поста
        const post = await this.postRepository.getById(postId);
        if (!post) return null;

        // Создаём комментарий
        return await this.commentRepository.create(postId, input, commentatorInfo);
    }

    async updateComment(commentId: string, input: UpdateCommentDto): Promise<boolean> {
        return await this.commentRepository.update(commentId, input);
    }

    async deleteComment(commentId: string): Promise<boolean> {
        return await this.commentRepository.delete(commentId);
    }

    async getCommentById(commentId: string) {
        return await this.commentRepository.getCommentById(commentId);
    }

    async getCommentsByPostId(postId: string, query: any) {
        const post = await this.postRepository.getById(postId);
        if (!post) return null;
        return await this.commentRepository.getCommentsByPostId(postId, query);
    }
}

import {CommentRepository} from "../repositories/commentRepository";
import {CommentViewModel, CommentDto} from "../models/commentModels";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {PostRepository} from "../repositories/postRepository";

@injectable()
export class CommentService  {
    constructor(
        @inject(TYPES.CommentRepository) private commentRepository: CommentRepository,
        @inject(TYPES.PostRepository) private postRepository: PostRepository,
    ) {
    }

    async createComment(postId: string, input: CommentDto, commentatorInfo: {
        userId: string;
        userLogin: string
    }): Promise<CommentViewModel | null> {
        const post = await this.postRepository.getById(postId);
        if (!post) return null;

        return await this.commentRepository.create(postId, input, commentatorInfo);
    }

    async updateComment(commentId: string, input: CommentDto): Promise<boolean> {
        return await this.commentRepository.update(commentId, input);
    }

    async deleteComment(commentId: string): Promise<boolean> {
        return await this.commentRepository.delete(commentId);
    }

}

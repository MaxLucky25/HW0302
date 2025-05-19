import {CommentRepository} from "../repositories/commentRepository";
import {CommentViewModel, CommentDto} from "../models/commentModels";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {PostQueryRepository} from "../queryRepo/postQueryRepository";

@injectable()
export class CommentService  {
    constructor(
        @inject(TYPES.CommentRepository) private commentRepository: CommentRepository,
        @inject(TYPES.PostQueryRepository) private postQueryRepository: PostQueryRepository,
    ) {
    }

    async createComment(postId: string, input: CommentDto, commentatorInfo: {
        userId: string;
        userLogin: string
    }): Promise<CommentViewModel | null> {
        const post = await this.postQueryRepository.getById(postId);
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

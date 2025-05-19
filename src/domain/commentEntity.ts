import { CommentDBType, CommentViewModel } from '../models/commentModels';

export class CommentEntity {
    constructor(private data: CommentDBType) {}

    get id() {return this.data.id;}

    get userId() {return this.data.commentatorInfo.userId;}

    static create(input: {
        content: string;
        postId: string;
        commentatorInfo: { userId: string; userLogin: string };
    }): CommentEntity {
        return new CommentEntity({
            id: Date.now().toString(),
            content: input.content,
            postId: input.postId,
            commentatorInfo: input.commentatorInfo,
            createdAt: new Date(),
        });
    }

    getViewModel(): CommentViewModel {
        const { id, content, createdAt, commentatorInfo } = this.data;
        return { id, content, createdAt, commentatorInfo };
    }
    toObject(): CommentDBType {
        return { ...this.data };
    }

}

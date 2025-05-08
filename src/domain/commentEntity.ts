import { CommentDBType, CommentViewModel } from '../models/commentModels';

export class CommentEntity {
    constructor(private data: CommentDBType) {}

    get id() {
        return this.data.id;
    }

    get userId() {
        return this.data.commentatorInfo.userId;
    }

    getViewModel(): CommentViewModel {
        const { id, content, createdAt, commentatorInfo } = this.data;
        return { id, content, createdAt, commentatorInfo };
    }

    static create(input: Omit<CommentDBType, 'id' | 'createdAt'>): CommentEntity {
        return new CommentEntity({
            ...input,
            id: Date.now().toString(),
            createdAt: new Date(),
        });
    }

    getDBData(): CommentDBType {
        return this.data;
    }

    updateContent(newContent: string) {
        this.data.content = newContent;
    }
}

import { model, Schema, Document, Model } from "mongoose";

export type CommentDBType = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
    createdAt: Date;
};

export type CommentViewModel = Omit<CommentDBType, 'postId'>;
export type CommentDto = { content: string };

export interface ICommentDocument extends Document {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
    createdAt: Date;
    toViewModel(): CommentViewModel;
}

export interface ICommentModelStatic extends Model<ICommentDocument> {
    createComment(input: {
        content: string;
        postId: string;
        commentatorInfo: { userId: string; userLogin: string };
    }): ICommentDocument;
}

const commentSchema = new Schema<ICommentDocument, ICommentModelStatic>({
    id: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now()},
});

commentSchema.statics.createComment = function(input: {
    content: string;
    postId: string;
    commentatorInfo: { userId: string; userLogin: string };
}): ICommentDocument {
    return new CommentModel({
        id: Date.now().toString(),
        content: input.content,
        postId: input.postId,
        commentatorInfo: input.commentatorInfo,
    });
};

commentSchema.methods.toViewModel = function(): CommentViewModel {
    const { id, content, createdAt, commentatorInfo } = this;
    return { id, content, createdAt, commentatorInfo };
};

export const CommentModel = model<ICommentDocument, ICommentModelStatic>('Comment', commentSchema);
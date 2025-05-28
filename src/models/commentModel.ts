import { model, Schema, Document, Model, Types } from "mongoose";
import {toObjectId} from "../utility/toObjectId";

export type CommentDBType = {
    _id: Types.ObjectId;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: Types.ObjectId;
    createdAt: Date;
};

export type CommentViewModel = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
};

export type CommentDto = { content: string };

export interface ICommentDocument extends Document<Types.ObjectId> {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: Types.ObjectId;
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
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    createdAt: { type: Date, required: true, default: Date.now()},
});

commentSchema.statics.createComment = function(input: {
    content: string;
    postId: string;
    commentatorInfo: { userId: string; userLogin: string };
}): ICommentDocument {
    return new CommentModel({
        content: input.content,
        postId: toObjectId(input.postId),
        commentatorInfo: input.commentatorInfo,
    });
};

commentSchema.methods.toViewModel = function(): CommentViewModel {
    return {
        id: this._id.toString(),
        content: this.content,
        createdAt: this.createdAt,
        commentatorInfo: this.commentatorInfo
    };
};

export const CommentModel = model<ICommentDocument, ICommentModelStatic>('Comment', commentSchema);
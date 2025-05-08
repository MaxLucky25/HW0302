import {CommentViewModel, CreateCommentDto, UpdateCommentDto } from '../models/commentModels';
import { getPaginationParams } from '../utility/commonPagination';
import {injectable} from "inversify";
import {CommentModel} from "../infrastructure/commentSchema";
import { CommentEntity } from '../domain/commentEntity';

@injectable()
export class CommentRepository  {
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await CommentModel.findOne({ id }).lean();
        if (!comment) return null;
        return new CommentEntity(comment).getViewModel();
    }

    async create(postId: string,
                 input: CreateCommentDto, commentatorInfo:
                 { userId: string; userLogin: string }): Promise<CommentViewModel> {
        const entity = CommentEntity.create({ content: input.content, postId, commentatorInfo });
        await new CommentModel(entity.getDBData()).save();
        return entity.getViewModel();
    }

    async update(id: string, input: UpdateCommentDto): Promise<boolean> {
        const result = await CommentModel.updateOne(
            { id },
            { $set: { content: input.content } }
        );
        return result.matchedCount === 1;
    }

    async delete(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({ id });
        return result.deletedCount === 1;
    }

    async getCommentsByPostId(postId: string, query: any): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = getPaginationParams(query);
        const filter = { postId };
        const totalCount = await CommentModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);
        const items = await CommentModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items.map(c => new CommentEntity(c).getViewModel()),
        };
    }
}

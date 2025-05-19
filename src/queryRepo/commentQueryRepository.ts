import {injectable} from "inversify";
import {CommentModel, CommentViewModel} from "../models/commentModels";
import {CommentEntity} from "../domain/commentEntity";
import {getPaginationParams} from "../utility/commonPagination";


@injectable()
export class CommentQueryRepository{
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await CommentModel.findOne({ id }).lean();
        if (!comment) return null;
        return new CommentEntity(comment).getViewModel();
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
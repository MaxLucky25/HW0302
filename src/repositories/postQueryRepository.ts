import { PostModel } from '../infrastructure/postSchema';
import { PostViewModel } from '../models/postModels';
import { getPaginationParams } from '../utility/commonPagination';
import {injectable} from "inversify";

@injectable()
export class PostQueryRepository {
    async getPosts(query: any): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = getPaginationParams(query);

        const filter = {};
        const totalCount = await PostModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);
        const items = await PostModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items as PostViewModel[],
        };
    }

    async getPostsByBlogId(blogId: string, query: any): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = getPaginationParams(query);
        const filter = { blogId };
        const totalCount = await PostModel.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);
        const items = await PostModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items as PostViewModel[],
        };
    }
}

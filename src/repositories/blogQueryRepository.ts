import { injectable } from 'inversify';
import { blogCollection } from '../db/mongo-db';
import { BlogViewModel } from '../models/blogModels';
import { getPaginationParams } from '../utility/commonPagination';

@injectable()
export class BlogQueryRepository {
    async getBlogs(query: any): Promise<any> {

        const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = getPaginationParams(query);

        const filter = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

        const totalCount = await blogCollection.countDocuments(filter);

        const pagesCount = Math.ceil(totalCount / pageSize);

        const items = await blogCollection.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: items.map(({ _id, ...rest }) => rest) as BlogViewModel[],
        };
    }
}

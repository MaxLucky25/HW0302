import {CommentViewModel, CommentDto, CommentModel } from '../models/commentModels';
import {injectable} from "inversify";


@injectable()
export class CommentRepository  {
    async create(postId: string,
                 input: CommentDto,
                 commentatorInfo: { userId: string; userLogin: string }
    ): Promise<CommentViewModel> {
        const comment = CommentModel.createComment({
            content: input.content,
            postId,
            commentatorInfo,
        });

        await comment.save();
        return comment.toViewModel();
    }

    async update(id: string, input: CommentDto): Promise<boolean> {
        const comment = await CommentModel.findOne({id});
        if (!comment) return false;

        comment.content = input.content;
        await comment.save();
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({ id });
        return result.deletedCount === 1;
    }

}

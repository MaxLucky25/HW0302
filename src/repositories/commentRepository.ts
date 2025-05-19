import {CommentViewModel, CommentDto, CommentModel } from '../models/commentModels';
import {injectable} from "inversify";
import { CommentEntity } from '../domain/commentEntity';

@injectable()
export class CommentRepository  {
    async create(postId: string,
                 input: CommentDto,
                 commentatorInfo: { userId: string; userLogin: string }
    ): Promise<CommentViewModel> {
        const entity = CommentEntity.create({
            content:input.content,
            postId,
            commentatorInfo,
        });

        const model = new CommentModel(entity.toObject());
        await model.save();

        return entity.getViewModel()
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

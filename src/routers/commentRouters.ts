import { Router} from 'express';
import { authJwtMiddleware } from '../middlewares/authJwtMiddleware';
import { inputCheckErrorsMiddleware } from '../middlewares/inputCheckErrorMiddleware';
import { commentValidators } from '../validators/commentValidators';
import container from "../di/iosContaner";
import { CommentController } from '../controllers/commentController';
import TYPES from '../di/types';


const controller = container.get<CommentController>(TYPES.CommentController);
export const commentRouter = Router();

commentRouter.get('/:id',controller.getCommentById );

commentRouter.put('/:commentId',
    authJwtMiddleware,
    commentValidators,
    inputCheckErrorsMiddleware,
    controller.updateComment
);
commentRouter.delete('/:commentId',
    authJwtMiddleware,
    controller.deleteComment
);



import { Router} from 'express';
import { authJwtMiddleware } from '../middlewares/authJwtMiddleware';
import { inputCheckErrorsMiddleware } from '../middlewares/inputCheckErrorMiddleware';
import { commentValidators } from '../validators/commentValidators';
import container from "../di/iosContaner";
import { CommentController } from '../controllers/commentController';
import TYPES from '../di/types';


const controller = container.get<CommentController>(TYPES.CommentController);
export const commentRouter = Router();

// Обновление комментария
commentRouter.put('/:commentId',
    authJwtMiddleware,
    commentValidators,
    inputCheckErrorsMiddleware,
    controller.updateComment
);
// Удаление комментария
commentRouter.delete('/:commentId',
    authJwtMiddleware,
    controller.deleteComment
);

commentRouter.get('/:id',controller.getCommentById );

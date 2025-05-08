import { Router} from 'express';
import {PostValidator} from '../validators/postValidators';
import { authBasicMiddleware } from '../middlewares/authBasicMiddleware';
import { inputCheckErrorsMiddleware } from '../middlewares/inputCheckErrorMiddleware';
import {authJwtMiddleware} from "../middlewares/authJwtMiddleware";
import {commentValidators} from "../validators/commentValidators";
import container from "../di/iosContaner";
import { PostController } from '../controllers/postController';
import TYPES from "../di/types";

const controller = container.get<PostController>(TYPES.PostController);
const validator = container.get<PostValidator>(TYPES.PostValidator);
export const postsRouter = Router();

postsRouter.get('/', controller.getAllPosts);

postsRouter.get('/:id', controller.getPostById);

postsRouter.post('/',
    authBasicMiddleware,
    validator.postValidator(),
    inputCheckErrorsMiddleware,
    controller.createPost
);

postsRouter.put('/:id',
    authBasicMiddleware,
    validator.postValidator(),
    inputCheckErrorsMiddleware,
    controller.updatePost
);

postsRouter.delete('/:id',
    authBasicMiddleware,
    controller.deletePost
);

postsRouter.get('/:postId/comments',controller.getCommentsByPostId);

postsRouter.post('/:postId/comments',
    authJwtMiddleware,
    commentValidators,
    inputCheckErrorsMiddleware,
    controller.createComment
);
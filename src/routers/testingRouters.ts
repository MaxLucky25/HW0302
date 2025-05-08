import { Router } from 'express';
import {BlogModel} from "../infrastructure/blogSchema";
import { PostModel } from '../infrastructure/postSchema';
import {UserModel} from "../infrastructure/userSchema";
import { CommentModel } from '../infrastructure/commentSchema';
import { RevokedTokenModel } from '../infrastructure/revokedScheme';
import {SessionModel} from "../infrastructure/sessionSchema";
import { RequestLogModel } from '../infrastructure/requestLogSchema';


export const testingRouters = Router();

testingRouters.delete('/all-data', async (req, res) => {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await RevokedTokenModel.deleteMany({});
    await RequestLogModel.deleteMany({});
    await SessionModel.deleteMany({});
    res.sendStatus(204);
});


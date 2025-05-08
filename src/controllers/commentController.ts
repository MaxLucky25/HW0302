import {Response, Request} from "express";
import {inject, injectable } from "inversify";
import TYPES from "../di/types";
import {CommentService} from "../services/commentService";

@injectable()
export class CommentController {
    constructor(
        @inject(TYPES.CommentService) private commentService: CommentService,
    ) {}

    updateComment = async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const userId = req.userId!;
        const comment = await this.commentService.getCommentById(commentId);
        if (!comment) {
            res.sendStatus(404);
            return;
        }
        if (comment.commentatorInfo.userId !== userId) {
            res.sendStatus(403);
            return;
        }
        const updated = await this.commentService.updateComment(commentId, { content: req.body.content });
        updated ? res.sendStatus(204) : res.sendStatus(400);
    }


    deleteComment = async (req: Request, res: Response) => {
        const { commentId } = req.params;
        const userId = req.userId!;
        const comment = await this.commentService.getCommentById(commentId);
        if (!comment) {
            res.sendStatus(404);
            return;
        }
        if (comment.commentatorInfo.userId !== userId) {
            res.sendStatus(403);
            return;
        }
        const deleted = await this.commentService.deleteComment(commentId);
        deleted ? res.sendStatus(204) : res.sendStatus(404);
    }

    getCommentById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const comment = await this.commentService.getCommentById(id);
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.sendStatus(404);
        }
    }

}
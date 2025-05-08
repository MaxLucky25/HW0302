import {body, ValidationChain} from 'express-validator';
import {BlogRepository} from '../repositories/blogRepository';
import {inject, injectable} from "inversify";
import TYPES from '../di/types';


@injectable()
export class PostValidator {
    constructor(
        @inject(TYPES.BlogRepository) private blogRepository: BlogRepository
    )
    {}

 postValidator(): ValidationChain [] {
    return [
    body('title')
        .trim()
        .isLength({ min: 1, max: 30 }).withMessage('Title length 1-30')
        .notEmpty().withMessage('Title is required'),

        body('shortDescription')
            .trim()
            .isLength({ min: 1, max: 100 }).withMessage('Short description length 1-100')
            .notEmpty().withMessage('Short description is required'),

        body('content')
            .trim()
            .isLength({ min: 1, max: 1000 }).withMessage('Content length 1-1000')
            .notEmpty().withMessage('Content is required'),
        body('blogId')
        .optional()
        .custom(async (value) => {
            const blog = await this.blogRepository.getById(value);
            if (!blog) throw new Error('Blog not found');
            return true;
        })
        .withMessage('Invalid blogId')
];

    }
}
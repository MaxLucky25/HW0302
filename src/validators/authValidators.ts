import {body, ValidationChain} from 'express-validator';
import {inject, injectable} from "inversify";
import TYPES from '../di/types';
import {UserQueryRepository} from "../queryRepo/userQueryRepository";


@injectable()
export class AuthValidator {
    constructor(
        @inject(TYPES.UserQueryRepository) private userQueryRepository: UserQueryRepository,
    ) {
    }

    loginValidators(): ValidationChain[] {
        return [
            body('loginOrEmail')
                .isString().withMessage('loginOrEmail must be a string')
                .notEmpty().withMessage('loginOrEmail is required'),
            body('password')
                .isString().withMessage('Password must be a string')
                .notEmpty().withMessage('Password is required')
        ];
    }


    registrationValidators(): ValidationChain[] {
        return [
            body('login')
                .isString().withMessage('Login must be a string')
                .trim()
                .isLength({min: 3, max: 10}).withMessage('Login must be between 3 and 10 characters')
                .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login contains invalid characters')
                .custom(async (login) => {
                    const user = await this.userQueryRepository.getByLogin(login);
                    if (user) {
                        throw new Error('Login already exists');
                    }
                    return true;
                }),

            body('password')
                .isString().withMessage('Password must be a string')
                .isLength({min: 6, max: 20}).withMessage('Password must be between 6 and 20 characters'),

            body('email')
                .isString().withMessage('Email must be a string')
                .trim()
                .isEmail().withMessage('Invalid email format')
                .custom(async (email) => {
                    // 🔧 Проверка существования email
                    const user = await this.userQueryRepository.getByEmail(email);
                    if (user) {
                        throw new Error('Email already exists');
                    }
                    return true;
                })
        ];
    }


    confirmationValidators(): ValidationChain[] {
        return [
        body('code')
            .isString().withMessage('Code must be a string')
            .notEmpty().withMessage('Code is required')
            .custom(async (code) => {
                const user = await this.userQueryRepository.findByConfirmationCode(code);
                if (!user) {
                    throw new Error('Incorrect, expired, or already confirmed code');
                }
                if (user.emailConfirmation.isConfirmed) {
                    throw new Error('Incorrect, expired, or already confirmed code');
                }
                if (new Date() > new Date(user.emailConfirmation.expirationDate)) {
                    throw new Error('Incorrect, expired, or already confirmed code');
                }
                return true;
            })
    ];
}


    emailResendingValidators(): ValidationChain[] {
        return [
            body('email')
                .isString().withMessage('Email must be a string')
                .trim()
                .isEmail().withMessage('Invalid email format')
                .custom(async (email) => {
                    const user = await this.userQueryRepository.getByEmail(email);
                    if (!user) {
                        throw new Error('User not found');
                    }
                    if (user.emailConfirmation.isConfirmed) {
                        throw new Error('Email already confirmed');
                    }
                    return true;
                })
        ];
    }

    recoveryEmailValidator(): ValidationChain[] {
        return [
            body('email')
                .isEmail().withMessage('Invalid email format')
                .notEmpty().withMessage('Email is required')
        ];
    }

    newPasswordValidator(): ValidationChain[] {
        return [
            body('newPassword')
                .isString().withMessage('Password must be a string')
                .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
            body('recoveryCode')
                .isString().withMessage('Recovery code must be a string')
                .notEmpty().withMessage('Recovery code is required')
                .custom(async (code) => {
                    const user = await this.userQueryRepository.getByRecoveryCode(code);
                    if (!user) {
                        throw new Error('Incorrect or expired recovery code');
                    }
                    const recovery = user.passwordRecovery;
                    if (!recovery || recovery.isConfirmed) {
                        throw new Error('Incorrect or expired recovery code');
                    }
                    if (new Date() > new Date(recovery.expirationDate)) {
                        throw new Error('Incorrect or expired recovery code');
                    }
                    return true;
                })
        ];
    }

}

import {Router} from "express";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorMiddleware";
import { authJwtMiddleware } from "../middlewares/authJwtMiddleware";
import {AuthValidator} from "../validators/authValidators";
import {AuthRefreshTokenMiddleware} from "../middlewares/authRefreshTokenMiddleware";
import {rateLimitMiddleware} from "../middlewares/rateLimitMiddleware";
import container from "../di/iosContaner";
import TYPES from "../di/types";
import { AuthController } from "../controllers/authController";



const controller = container.get<AuthController>(TYPES.AuthController);
const validator = container.get<AuthValidator>(TYPES.AuthValidator);
const authRefreshValidator = container.get<AuthRefreshTokenMiddleware>(TYPES.AuthRefreshTokenMiddleware)
export const authRouter = Router();



authRouter.post('/login',
    rateLimitMiddleware,
    validator.loginValidators(),
    inputCheckErrorsMiddleware,
    controller.login
);

authRouter.post('/refresh-token',
    rateLimitMiddleware,
    authRefreshValidator.execute,
    controller.refreshTokens
);


authRouter.post('/logout',
    rateLimitMiddleware,
    authRefreshValidator.execute,
    controller.logout
);

authRouter.get('/me',
    rateLimitMiddleware,
    authJwtMiddleware,
    controller.getMe
);

authRouter.post('/registration',
    rateLimitMiddleware,
    validator.registrationValidators(),
    inputCheckErrorsMiddleware,
    controller.register
);

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    validator.confirmationValidators(),
    inputCheckErrorsMiddleware,
    controller.confirm
);

authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    validator.emailResendingValidators(),
    inputCheckErrorsMiddleware,
    controller.resendEmail
);

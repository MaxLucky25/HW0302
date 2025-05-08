import { Router} from "express";
import {AuthRefreshTokenMiddleware} from "../middlewares/authRefreshTokenMiddleware";
import {SecurityController} from "../controllers/securityController";
import container from "../di/iosContaner";
import TYPES from "../di/types";

const authRefreshValidator = container.get<AuthRefreshTokenMiddleware>(TYPES.AuthRefreshTokenMiddleware)
const controller = container.get<SecurityController>(TYPES.SecurityController)
export const securityRouter = Router();

securityRouter.get("/devices",
    authRefreshValidator.execute,
    controller.findAllByUser
);

securityRouter.delete("/devices",
    authRefreshValidator.execute,
    controller.deleteAllExcept
);

securityRouter.delete("/devices/:deviceId",
    authRefreshValidator.execute,
    controller.deleteByDeviceId
);

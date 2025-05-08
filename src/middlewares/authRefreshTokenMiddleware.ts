import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../utility/config';
import {RevokedTokenRepository} from '../repositories/revokedTokenRepository';
import {inject, injectable} from "inversify";
import TYPES from "../di/types";

@injectable()
export class AuthRefreshTokenMiddleware {
    constructor(
        @inject(TYPES.RevokedTokenRepository)private revokedTokenRepository: RevokedTokenRepository,
    ) {}

    execute = async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            res.sendStatus(401);
            return;
        }

        try {
            const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as JwtPayload;

            const isRevoked = await this.revokedTokenRepository.isRevoked(refreshToken);
            if (isRevoked) {
                res.sendStatus(401);
                return;
            }

            // Добавим все поля как и в authJwtMiddleware
            req.userId = decoded.userId;
            req.userLogin = decoded.login;
            req.userEmail = decoded.email;
            req.refreshToken = refreshToken;

            next();
        } catch (e) {
            res.sendStatus(401);
            return;
        }

    }
}

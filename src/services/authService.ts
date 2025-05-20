import { randomUUID } from "crypto";
import { add } from "date-fns";
import {BcryptService} from "./bcryptService";
import {UserRepository} from "../repositories/userRepository";
import {EmailService} from "./emailService";
import {JwtService} from "./jwtService";
import {SessionRepository} from "../repositories/sessionRepository";
import {inject, injectable} from "inversify";
import TYPES from "../di/types";
import {UserModel} from "../models/userModel";


@injectable()
export class AuthService {
    constructor(
        @inject(TYPES.BcryptService) private bcryptService: BcryptService,
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.SessionRepository) private sessionRepository: SessionRepository,
        @inject(TYPES.EmailService) private emailService: EmailService,
        @inject(TYPES.JwtService) private jwtService: JwtService,
    ) {}
    async login(loginOrEmail: string, password: string,  ip: string, title: string):
        Promise<{ accessToken: string, refreshToken: string } | null> {

        const user = await UserModel.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        });
        if (!user || !user.emailConfirmation.isConfirmed) return null;

        const isValid = await this.bcryptService.compareHash(password, user.password);
        if (!isValid) return null;


        const deviceId = randomUUID();
        const lastActiveDate = new Date().toISOString();
        const expiresDate = add(new Date(), { days: 7 }).toISOString();

        const payload = { userId: user.id, deviceId, lastActiveDate };

        await this.sessionRepository.createSession({
            userId: user.id,
            deviceId,
            ip,
            title,
            lastActiveDate,
            expiresDate
        });
        return {
            accessToken: this.jwtService.createAccessToken({
                userId: user.id,
                login: user.login,
                email: user.email,
            }),
            refreshToken: this.jwtService.createRefreshToken(payload),
        };
    }

    async refreshTokens(refreshToken: string, ip: string, title: string) {

        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || !payload.userId || !payload.deviceId || !payload.lastActiveDate) return null;

        const session = await this.sessionRepository.findByDeviceId(payload.deviceId);
        if (!session || session.lastActiveDate !== payload.lastActiveDate) return null;

        const newLastActiveDate = new Date().toISOString();
        const newExpiresDate = add(new Date(), {days: 7 }).toISOString();

        await this.sessionRepository.updateLastActiveDate(
            payload.deviceId,
            newLastActiveDate,
            newExpiresDate,
            ip,
            title
        );

        const newPayload = {
            userId: payload.userId,
            deviceId: payload.deviceId,
            lastActiveDate: newLastActiveDate
        };

        const user = await UserModel.findOne({ id: payload.userId });
        if (!user) return null;

        return {
            accessToken: this.jwtService.createAccessToken({
                userId: payload.userId,
                login: payload.userLogin,
                email: payload.userEmail,
            }),
            refreshToken: this.jwtService.createRefreshToken(newPayload)
        };
    }


    async register(login: string, password: string, email: string) {
        if (await this.userRepository.doesExistByLoginOrEmail(login, email)) {
            return null;
        }
        const hashedPassword = await this.bcryptService.generateHash(password);
        const user = await UserModel.createUser({
            login: login,
            password: hashedPassword,
            email: email,
            isConfirmed: false,
        });

        await this.emailService.sendRegistrationEmail(email, user.emailConfirmation.confirmationCode);

        return {
            userId: user.id,
            confirmationCode: user.emailConfirmation.confirmationCode
        };
    }

    async confirm(code: string): Promise<boolean> {
        const user = await UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
        if (!user || user.emailConfirmation.isConfirmed || user.emailConfirmation.expirationDate < new Date()) {
            return false;
        }

        return await this.userRepository.updateConfirmation(user.id, { isConfirmed: true });
    }

    async resendEmail(email: string): Promise<string | null> {
        const user = await UserModel.findOne({ email });
        if (!user || user.emailConfirmation.isConfirmed) return null;

        const newConfirmation = {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), { hours: 1 }),
            isConfirmed: false
        };
        const updated = await this.userRepository.updateConfirmation(user.id, newConfirmation);
        if (!updated) return null;

        const sent = await this.emailService.sendRegistrationEmail(email, newConfirmation.confirmationCode);
        return sent ? newConfirmation.confirmationCode : null;
    }

    async sendPasswordRecoveryCode(email: string): Promise<boolean> {
        const user = await UserModel.findOne({ email });
        if (!user || !user.emailConfirmation.isConfirmed) return false;

        const recoveryCode = randomUUID();
        const expirationDate = add(new Date(), { minutes: 1 });

        const updated = await this.userRepository.updateRecovery(user.id, {
            recoveryCode,
            expirationDate,

        });
        if (!updated) return false;

        return await this.emailService.sendRecoveryEmail(email, recoveryCode);
    }

    async confirmNewPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const user = await UserModel.findOne({ 'passwordRecovery.recoveryCode': recoveryCode });
        if (
            !user ||
            !user.passwordRecovery?.recoveryCode ||
            user.passwordRecovery.expirationDate < new Date()
        ) return false;

        const newHash = await this.bcryptService.generateHash(newPassword);

        return await this.userRepository.updatePassword(user.id, newHash);
    }


}
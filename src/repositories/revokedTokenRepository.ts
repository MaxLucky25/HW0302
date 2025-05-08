import {injectable} from "inversify";
import {RevokedTokenModel} from "../infrastructure/revokedScheme";

@injectable()
export class RevokedTokenRepository  {
    async add(token: string, expiresAt: Date): Promise<void> {
        await RevokedTokenModel.create({ token, expiresAt });
    }

    async isRevoked(token: string): Promise<boolean> {
        const tokenDoc = await RevokedTokenModel.findOne({ token }).lean();
        return !!tokenDoc;
    }
}
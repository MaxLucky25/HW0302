import { revokedTokensCollection } from "../db/mongo-db";
import {injectable} from "inversify";

@injectable()
export class RevokedTokenRepository  {
    async add(token: string, expiresAt: Date): Promise<void> {
        await revokedTokensCollection.insertOne({ token, expiresAt });
    }

    async isRevoked(token: string): Promise<boolean> {
        const tokenDoc = await revokedTokensCollection.findOne({ token });
        return !!tokenDoc;
    }
}
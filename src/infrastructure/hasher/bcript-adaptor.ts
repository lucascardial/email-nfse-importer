import { hash, compare } from "bcrypt";
import { IHasher } from "../../application/commom/services/hasher.interface";
import { injectable } from "inversify";

@injectable()
export class BcryptAdapter implements IHasher {

    private readonly salt: number = 10;

    async hash(plaintext: string): Promise<string> {
        return await hash(plaintext, this.salt);
    }

    async compare(plaintext: string, hash: string): Promise<boolean> {
        return await compare(plaintext, hash)
    }
}
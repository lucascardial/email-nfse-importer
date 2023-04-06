import { sign, verify } from "jsonwebtoken";
import { IJwt } from "../../application/authentication/commom/jwt.interface";
import { User } from "../../domain/entities";
import { injectable } from "inversify";

@injectable()
export class JwtService implements IJwt {
    sign(payload: User): Promise<string> {
        const token = sign(payload, 'super-secret-key', { expiresIn: '6h' });
        return Promise.resolve(token);
    }

    verify(token: string): Promise<any> {
        const verified = verify(token, 'super-secret-key');
        return Promise.resolve(verified);
    }

}
import { inject, injectable } from "inversify";
import { InvalidCredentialsError } from "../../../../domain/commom/errors/authentication";
import { ErrorOr, left, right } from "../../../../lib/error-or/error-or.interface";
import { IHasher } from "../../../commom/services/hasher.interface";
import { IUserRepository } from "../../../persistence/user.repository";
import { LoginQuery } from "./login.query";
import { LoginResult } from "./login.result";
import { IJwt } from "../../commom/jwt.interface";

@injectable()
export class LoginQueryHandler {
    constructor(
        @inject('IUserRepository') private readonly authenticationRepository: IUserRepository,
        @inject('IHasher') private readonly hasher: IHasher,
        @inject('IJwt') private readonly jwtService: IJwt,
    ) {}

    async execute(command: LoginQuery): Promise<ErrorOr<LoginResult>> {
        const user = await this.authenticationRepository.findByLogin(command.login);

        if (!user) {
            return left(new InvalidCredentialsError());
        }

        const passwordMatch = await this.hasher.compare(command.password, user.password);
        if (!passwordMatch) {
            return left(new InvalidCredentialsError())
        }

        const jwt = await this.jwtService.sign({ login: user.login });

        return right(new LoginResult(jwt));
    }
}
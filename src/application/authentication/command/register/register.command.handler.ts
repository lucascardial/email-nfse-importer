import { inject, injectable } from "inversify";
import { UserAlreadyExistsError } from "../../../../domain/commom/errors/authentication";
import { User } from "../../../../domain/entities";
import { ErrorOr, left, right } from "../../../../lib/error-or/error-or.interface";
import { IHasher } from "../../../commom/services/hasher.interface";
import { IUserRepository as IUserRepository } from "../../../persistence/user.repository";
import { RegisterCommand } from "./register.command";
import { RegisterResult } from "./register.command.result";

@injectable()
export class RegisterCommandHandler {
    constructor(
        @inject('IUserRepository') private readonly userRepository: IUserRepository,
        @inject('IHasher') private readonly passwordHasher: IHasher
    ) {}

    async handle(command: RegisterCommand): Promise<ErrorOr<RegisterResult>> {
        const user = await this.userRepository.findByLogin(command.login);
        
        if (user) {
            return left(new UserAlreadyExistsError());
        }

        const hashedPassword = await this.passwordHasher.hash(command.password);
        const newUser = new User(command.login, hashedPassword);
        await this.userRepository.save(newUser);

        return right(new RegisterResult(true))
    }
}
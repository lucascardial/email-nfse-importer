import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { RegisterCommandHandler } from "../../../application/authentication/command/register/register.command.handler";
import { isLeft } from "../../../lib/error-or/error-or.interface";

@injectable()
export class RegisterUserController {
    constructor(
        @inject(RegisterCommandHandler) private readonly registerUser: RegisterCommandHandler,
    ) {}

    async handle(request: Request, response: Response): Promise<Response> {

            const { login, password } = request.body;

            if(!login || !password) {
                return response.status(400).send({ message: 'Invalid request' });
            }

            const data = await this.registerUser.handle({
                login,
                password,
            });

            if(isLeft(data)) {
                return response.status(409).send({ message: data.error?.message });
            }

            return response.status(201).send({ message: 'User created'});
        
    }
}
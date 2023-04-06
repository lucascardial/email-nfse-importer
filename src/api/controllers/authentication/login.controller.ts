import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { LoginQuery } from "../../../application/authentication/querie/login/login.query";
import { LoginQueryHandler } from "../../../application/authentication/querie/login/login.query.handler";
import { isLeft } from "../../../lib/error-or/error-or.interface";

@injectable()
export class LoginController {
    constructor(
        @inject(LoginQueryHandler) private readonly loginCommand: LoginQueryHandler,
    ) { }

    async handle(request: Request, response: Response): Promise<Response> {
        const { login, password } = request.body;

        if(!login) {
            return response.status(400).json({ message: 'o login é obrigatório!' });
        }

        if(!password) {
            return response.status(400).json({ message: 'a senha é obrigatória!' });
        }

        const command = new LoginQuery(login, password);

        const result = await this.loginCommand.execute(command);

        if(isLeft(result)) {
            return response.status(400).json({ message: result.error?.message });
        }

        return response.json(result.value);
    }
}
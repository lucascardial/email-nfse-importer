import { inject, injectable } from "inversify";
import { CreateRouteCommandHandler } from "../../application/route/commands/create-route/create-route.comand-handler";
import { CreateRouteCommand } from "../../application/route/commands/create-route/create-route.command";
import { Request, Response } from "express";

@injectable()
export class CreateRouteController {
  constructor(
    @inject(CreateRouteCommandHandler)
    private readonly commandHandler: CreateRouteCommandHandler
  ) {}

  async handle(request: Request, response: Response) {
    const { name } = request.body;
    const command = new CreateRouteCommand();
    command.name = name;

    await this.commandHandler.handle(command);

    return response.status(201).send("");
  }
}

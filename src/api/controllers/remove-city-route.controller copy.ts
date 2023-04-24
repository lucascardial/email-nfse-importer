import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { RemoveCityCommandHandler } from "../../application/route/commands/remove-city/remove-city.command-handler";
import { RemoveCityCommand } from "../../application/route/commands/remove-city/remove-city.command";

@injectable()
export class RemoveCityFromRouteController {
    constructor(
       @inject(RemoveCityCommandHandler) private readonly handler: RemoveCityCommandHandler
    ){}

    async handle(request: Request, response: Response) {
        const { routeId, cityCode } = request.params;

        const command = new RemoveCityCommand();
        command.routeUid = routeId;
        command.cityCode = parseInt(cityCode);

        await this.handler.handle(command);

        return response.status(201).send('');
    }
}
import { inject, injectable } from "inversify";
import { AddCityCommandHandler } from "../../application/route/commands/add-city/add-city.command-handler";
import { Request, Response } from "express";
import { AddCityCommand } from "../../application/route/commands/add-city/add-city.command";

@injectable()
export class AddCityToRouteController {
    constructor(
       @inject(AddCityCommandHandler) private readonly handler: AddCityCommandHandler
    ){}

    async handle(request: Request, response: Response) {
        const { routeId, cityCode } = request.params;

        const command = new AddCityCommand();
        command.routeUid = routeId;
        command.cityCode = parseInt(cityCode);

        await this.handler.handle(command);

        return response.status(201).send('');
    }
}
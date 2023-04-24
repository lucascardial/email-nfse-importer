import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { DeleteRouteCommandHandler } from "../../application/route/commands/delete-route/delete-route.command-handler";
import { DeleteRouteCommand } from "../../application/route/commands/delete-route/delete-route.command";

@injectable()
export class DeleteRouteController {
    constructor(
        @inject(DeleteRouteCommandHandler) private readonly handler: DeleteRouteCommandHandler
    ) { }

    async handle(request: Request, response: Response) {
        const { routeUid } = request.params;

        const command = new DeleteRouteCommand();
        command.routeUid = routeUid;

        await this.handler.handle(command);

        return response.status(204).send('');
    }
}
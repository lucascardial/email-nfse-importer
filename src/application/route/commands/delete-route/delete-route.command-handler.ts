import { inject, injectable } from "inversify";
import { DeleteRouteCommand } from "./delete-route.command";
import { IRouteRepository } from "../../../persistence";

@injectable()
export class DeleteRouteCommandHandler {
    constructor(
        @inject('IRouteRepository') private readonly routeRepository: IRouteRepository
    ) { }

    public async handle(command: DeleteRouteCommand): Promise<void> {
        await this.routeRepository.deleteRoute(command.routeUid)
    }
}
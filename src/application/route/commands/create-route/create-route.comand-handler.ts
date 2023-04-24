import { inject, injectable } from "inversify";
import { IRouteRepository } from "../../../persistence/route-repository.interface";
import { CreateRouteCommand } from "./create-route.command";
import { Route } from "../../../../domain/entities/route";
import { v4 } from "uuid";

@injectable()
export class CreateRouteCommandHandler {
    constructor(
        @inject("IRouteRepository") private readonly routeRepository: IRouteRepository,
    ) {}

    async handle(command: CreateRouteCommand) {

        const checkIfRouteExists = await this.routeRepository.findRouteByName(command.name);

        if(checkIfRouteExists) {
            throw new Error('AVISO: Já existe uma rota com esse nome');
        }

        const route = Route.fromJSON({
            uid: v4(),
            name: command.name,
        });
        
        return this.routeRepository.createRoute(route);
    }
}
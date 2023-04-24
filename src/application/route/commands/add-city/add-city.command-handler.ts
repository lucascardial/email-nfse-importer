import { inject, injectable } from "inversify";
import { IRouteRepository } from "../../../persistence/route-repository.interface";
import { AddCityCommand } from "./add-city.command";

@injectable()
export class AddCityCommandHandler {
    constructor(
        @inject("IRouteRepository") private readonly routeRepository: IRouteRepository
    ) {}

    async handle(command: AddCityCommand) {

        const cityAlreadyAssociated = await this.routeRepository.findRouteByCity(command.cityCode);

        if(cityAlreadyAssociated) {
            throw new Error(`AVISO: A cidade já está associada à rota ${cityAlreadyAssociated.name}`);
        }

        await this.routeRepository.addCity(command.routeUid, command.cityCode);
    }
}
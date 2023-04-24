import { inject, injectable } from "inversify";
import { IRouteRepository } from "../../../persistence/route-repository.interface";
import { RemoveCityCommand } from "./remove-city.command";

@injectable()
export class RemoveCityCommandHandler {
    constructor(
        @inject('IRouteRepository') private readonly routeRepository: IRouteRepository
    ) { }

    public async handle(command: RemoveCityCommand): Promise<void> {
        await this.routeRepository.removeCity(command.routeUid, command.cityCode)
    }
}
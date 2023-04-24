import { inject, injectable } from "inversify";
import { ICityRepostory } from "../../../persistence/city-repository.interface";
import { SearchCitiesQuery } from "./search-cities.query";
import { SearchCitiesQueryResult } from "./search-cities.query-result";

@injectable()
export class SearchCitiesQueryHandler {
    constructor(
        @inject('ICityRepostory') private readonly cityRepository: ICityRepostory
    ) { }

    public async execute(query: SearchCitiesQuery): Promise<SearchCitiesQueryResult> {
        const result = await this.cityRepository.getByNameContaining(query.name)
            .then(cities => cities.map(city => ({
                code: parseInt(city.code),
                name: `${city.name} - ${city.stateInitials}`,
            })));

        return new SearchCitiesQueryResult(result);
    }
}
import { inject, injectable } from "inversify";
import { SearchCitiesQueryHandler } from "../../application/city/queries/search-cities/search-cities.query-handler";
import { Request, Response } from "express";

@injectable()
export class SearchCitiesController {
    constructor(
        @inject(SearchCitiesQueryHandler) private readonly searchCitiesQueryHandler: SearchCitiesQueryHandler
    ) { }

    async handle(request: Request, response: Response) {
        const result = await this.searchCitiesQueryHandler.execute({
            name: request.query.name as string
        });

        response.json(result);
    }
}
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { GetRoutesQueryHandler } from '../../application/route/queries/get-routes/get-routes.query-handler';

@injectable()
export class GetRoutesController {
    constructor(
        @inject(GetRoutesQueryHandler) private readonly getRoutesQueryHandler: GetRoutesQueryHandler,
    ) {}

    async handle(request: Request, response: Response) {
        const routes = await this.getRoutesQueryHandler.handle();

        return response.json(routes);
    }
}
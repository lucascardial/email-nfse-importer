import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { GetIssuerCompaniesQueryHandler } from "../../application/invoice/queries/get-issuer-companies/get-issuer-companies.query.handler";

@injectable()
export class GetIssuerCompaniesController {
    constructor(
       @inject(GetIssuerCompaniesQueryHandler) private readonly _getIssuerCompaniesQueryHandler: GetIssuerCompaniesQueryHandler
    ) {}

    async handle(request: Request, response: Response): Promise<void> {
        const data = await this._getIssuerCompaniesQueryHandler.handle();

        response.send(data);
    }
}
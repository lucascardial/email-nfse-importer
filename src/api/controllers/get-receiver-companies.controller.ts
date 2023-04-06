import { Request, Response } from 'express'
import { GetReceiverCompaniesQueryHandler } from '../../application/invoice/queries/get-receiver-companies/get-receiver-companies.query.handler'
import { inject, injectable } from 'inversify'
import { GetReceiverCompaniesQuery } from '../../application/invoice/queries/get-receiver-companies/get-receiver-companies.query';


@injectable()
export class GetReceiverCompaniesController {
    constructor(
        @inject(GetReceiverCompaniesQueryHandler) private readonly getReceiverCompaniesQueryHandler: GetReceiverCompaniesQueryHandler
    ) {}

    async handle(request: Request, response: Response): Promise<void> {
        const { cnpj_issuer } = request.query;

        if(!cnpj_issuer) {
            response.status(400).send({ message: 'Invalid request' });
            return;
        }

        const command = new GetReceiverCompaniesQuery(parseInt(cnpj_issuer as string));
        
        const data = await this.getReceiverCompaniesQueryHandler.handle(command)

        response.send(data)
    }
}
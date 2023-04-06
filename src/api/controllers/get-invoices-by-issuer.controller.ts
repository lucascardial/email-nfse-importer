import { inject, injectable } from "inversify";
import { GetInvoiceByIssuerQueryHandler } from "../../application/invoice/queries/get-invoices-by-issuer/get-invoices-by-issuer.query-handler";
import { Request, Response } from "express";
import { GetInvoiceByIssuerQuery } from "../../application/invoice/queries/get-invoices-by-issuer/get-invoices-by-issuer.query";

@injectable()
export class GetInvoiceByIssuerController {
    constructor(
        @inject(GetInvoiceByIssuerQueryHandler) private readonly getInvoiceByIssuerQueryHandler: GetInvoiceByIssuerQueryHandler
    ) {}

    async handle(request: Request, response: Response): Promise<void> {
        const { date, cnpj_issuer, cnpj_receiver, page } = request.query;

        if(!date || !cnpj_issuer) {
            response.status(400).send({ message: 'Invalid request' });
            return;
        }

        const _date = new Date(date as string);

        const command = new GetInvoiceByIssuerQuery(_date, parseInt(cnpj_issuer as string));
        command.page = page ? parseInt(page as string) : 1;
        command.receiverCnpj = cnpj_receiver ? parseInt(cnpj_receiver as string) : undefined;

        const data = await this.getInvoiceByIssuerQueryHandler.handle(command)

        response.send(data)
    }
}
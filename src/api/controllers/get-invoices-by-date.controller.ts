import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { GetInvoiceByDateQueryHandler } from "../../application/invoice/queries/get-invoices/get-invoice-by-date.query.handler";
import { GetInvoiceByDateQuery } from "../../application/invoice/queries/get-invoices/get-invoice-by-date.query";

@injectable()
export class GetInvoiceByDateController {
    constructor(
        @inject(GetInvoiceByDateQueryHandler) private readonly getInvoiceByDateQueryHandler: GetInvoiceByDateQueryHandler
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { date, page, cnpj } = req.query;

        if(!date) {
            return res.status(400).json({
                message: 'Date is required'
            });
        }

        const query = new GetInvoiceByDateQuery(new Date(date as string));
        query.cnpj = cnpj ? parseInt(cnpj as string) : undefined;
        query.page = page ? parseInt(page as string) : 1;

        const invoices = await this.getInvoiceByDateQueryHandler.handle(query);

        return res.status(200).json(invoices);
    }
}
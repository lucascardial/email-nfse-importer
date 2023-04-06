import { inject, injectable } from "inversify";
import { GetInvoiceErrorsQuery } from "../../application/invoice/queries/get-invoice-errors/get-invoice-errors.query";
import { Request, Response } from "express";

@injectable()
export class GetInvoiceErrorsController {

    constructor(
        @inject(GetInvoiceErrorsQuery) private readonly query: GetInvoiceErrorsQuery
    ){}

    async handle(request: Request, response: Response) {
        const result = await this.query.execute()

        response.send(result)
    }
}
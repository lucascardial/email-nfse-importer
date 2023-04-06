import { inject, injectable } from "inversify";
import { IInvoiceErrorRepository } from "../../../persistence";
import { InvoiceError } from "../../../../domain/entities";

@injectable()
export class GetInvoiceErrorsQuery {
    constructor(
        @inject('IInvoiceErrorRepository') private readonly invoiceErrorRepository: IInvoiceErrorRepository,
    ) { }

    async execute(): Promise<InvoiceError[]> {
        return await this.invoiceErrorRepository.findAll();
    }
}
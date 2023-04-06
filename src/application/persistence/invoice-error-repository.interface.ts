import { InvoiceError } from "../../domain/entities";

export interface IInvoiceErrorRepository {
    save(invoice_Error: InvoiceError): Promise<void>;
    findByFileName(fileName: string): Promise<InvoiceError | undefined>;
    findAll(): Promise<InvoiceError[]>;
}
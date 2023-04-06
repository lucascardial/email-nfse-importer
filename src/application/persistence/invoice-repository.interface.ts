import { Invoice } from "../../domain/entities";

export interface IInvoiceRepository {
    save(invoice: Invoice): Promise<void>;
    count(criteria?: Record<string, unknown>): Promise<number>;
    findByAccessKey(accessKey: string): Promise<Invoice | undefined>;
    findBySenderDocumentNumber(issuerCnpj: number): Promise<Invoice[]>;
    findByRecipientDocumentNumber(recipientCnpj: number): Promise<Invoice[]>;
    findByIssueDate(issueDate: Date): Promise<Invoice[]>;
    findByCreatedAt(createdAt: Date): Promise<Invoice[]>;
}
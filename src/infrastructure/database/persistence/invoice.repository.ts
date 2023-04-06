import { inject, injectable } from "inversify";
import { IInvoiceRepository } from "../../../application/persistence/invoice-repository.interface";
import { Invoice } from "../../../domain/entities";
import { IDBClient } from "../connection/commom/db-client.interface";
import { IDBConnection } from "../connection/commom/db-connection.interface";

@injectable()
export class InvoiceRepository implements IInvoiceRepository {
    private readonly dbClient: IDBClient;

    constructor( 
        @inject('IDBConnection') dbConnection: IDBConnection
    ) {
        this.dbClient = dbConnection.getConnection();
    }

    async save(invoice: Invoice): Promise<void> {
        await this
            .dbClient
            .query(`
            INSERT INTO invoices (
                access_key,
                issuer_cnpj,
                recipient_cnpj,
                quantity,
                gross_weight,
                total_value,
                issue_date,
                created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                invoice.accessKey,
                invoice.issuerCnpj.getCnpj(),
                invoice.recipientCnpj.getCnpj(),
                invoice.quantity,
                invoice.grossWeight,
                invoice.totalValue,
                invoice.issueDate,
                invoice.createdAt
            ]);
    }

    async count(criteria?: Record<string,
        unknown> | undefined): Promise<number> {
        const result = await this.dbClient.query(`
            SELECT COUNT(*) FROM invoices
        `);
        
        return result.rows[0].count;
    }

    async findByAccessKey(accessKey: string): Promise<Invoice | undefined> {
        const { rows } = await this.dbClient.query(`
            SELECT * FROM invoices WHERE access_key = $1
        `, [ accessKey]);
        
        
        if (!rows[0]) {
            return undefined;
        }

        return Invoice.newFromJson(rows[0]);
    }

    async findBySenderDocumentNumber(issuerCnpj: number): Promise<Invoice[]> {
        const { rows } = await this.dbClient.query(`
            SELECT * FROM invoices WHERE issuer_cnpj = $1
        `, [ issuerCnpj]);

        return rows.map((row: any) => Invoice.newFromJson(row));
    }

    async findByRecipientDocumentNumber(recipientCnpj: number): Promise<Invoice[]> {
        const { rows } = await this.dbClient.query(`
            SELECT * FROM invoices WHERE recipient_cnpj = $1
        `, [ recipientCnpj]);

        return rows.map((row: any) => Invoice.newFromJson(row));
    }

    async findByIssueDate(issueDate: Date): Promise<Invoice[]> {
        const { rows } = await this.dbClient.query(`
            SELECT * FROM invoices WHERE issue_date = $1
        `, [ issueDate]);

        return rows.map((row: any) => Invoice.newFromJson(row));
    }

    async findByCreatedAt(createdAt: Date): Promise<Invoice[]> {
        const date = createdAt.toISOString().split('T')[0];

        const dateRange = [`${date} 00:00:00`, `${date} 23:59:59`];
        
        const { rows } = await this.dbClient.query(`
            SELECT * FROM invoices WHERE created_at BETWEEN $1 AND $2
        `,dateRange);

        return rows.map((row: any) => Invoice.newFromJson(row));
    }
}
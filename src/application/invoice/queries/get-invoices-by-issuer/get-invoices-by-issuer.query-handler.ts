import { inject, injectable } from "inversify";
import { IDBClient } from "../../../../infrastructure/database/connection/commom/db-client.interface";
import { GetInvoiceByIssuerQuery } from "./get-invoices-by-issuer.query";

@injectable()
export class GetInvoiceByIssuerQueryHandler {
    constructor(@inject("IDBClient") private readonly dbClient: IDBClient) {}

    async handle(query: GetInvoiceByIssuerQuery): Promise<any> {
        const date = query.date.toISOString().split('T')[0];

        const dateRange = [`${date} 00:00:00`, `${date} 23:59:59`];

        const { page = 1, limit = 20, issuerCnpj, receiverCnpj } = query;
        const offset = (page - 1) * limit;

        let queryParams: any[] = [issuerCnpj, ...dateRange];

        if (receiverCnpj) {
            queryParams.push(receiverCnpj);
        }

        // Consulta para obter o número total de resultados
        const totalQuery = await this.dbClient.query(`
            SELECT COUNT(DISTINCT companies.cnpj)
            FROM invoices
            INNER JOIN companies ON companies.cnpj = invoices.recipient_cnpj
            WHERE
                invoices.issuer_cnpj = $1 AND
                invoices.created_at BETWEEN $2 AND $3
                ${receiverCnpj ? `AND companies.cnpj = $4` : ""}
        `, [...queryParams]);

        const total = parseInt(totalQuery.rows[0].count);

        queryParams = [issuerCnpj, ...dateRange, limit, offset];

        if (receiverCnpj) {
            queryParams.push(receiverCnpj);
        }
        
        const { rows } = await this.dbClient.query(`
            SELECT 
                receiver.cnpj,
                receiver.business_name AS receiver,
                invoices.quantity,
                invoices.gross_weight,
                invoices.created_at as date
            FROM invoices
            INNER JOIN companies AS receiver ON receiver.cnpj  = invoices.recipient_cnpj 
            WHERE 
                invoices.issuer_cnpj = $1 AND
                invoices.created_at BETWEEN $2 AND $3
                ${receiverCnpj ? `AND receiver.cnpj = $6` : ""}
            LIMIT $4 OFFSET $5
        `, [...queryParams]);
    
        const lastPage = Math.ceil(total / limit);

        return {
            meta: {
                total,
                page,
                lastPage,
                limit,
            },
            data: rows.map((row: any) => ({
                cnpj: row.cnpj,
                receiver: row.receiver,
                quantity: row.quantity,
                grossWeight: row.gross_weight,
                date,
            })),
        };
    }
}
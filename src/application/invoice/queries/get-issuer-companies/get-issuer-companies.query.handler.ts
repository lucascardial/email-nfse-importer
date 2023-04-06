import { inject, injectable } from "inversify";
import { IDBClient } from "../../../../infrastructure/database/connection/commom/db-client.interface";

@injectable()
export class GetIssuerCompaniesQueryHandler {
    constructor(
        @inject('IDBClient') private readonly dbClient: IDBClient
    ) {}

    async handle(): Promise<any[]> {
        const { rows } = await this.dbClient.query(`
            SELECT DISTINCT
                issuer.cnpj,
                issuer.business_name AS issuer
            FROM invoices
            INNER JOIN companies AS issuer ON issuer.cnpj  = invoices.issuer_cnpj
        `);
    
        return rows
    }
}
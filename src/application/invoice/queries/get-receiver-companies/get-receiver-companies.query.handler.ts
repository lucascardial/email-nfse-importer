import { inject, injectable } from "inversify";
import { IDBClient } from "../../../../infrastructure/database/connection/commom/db-client.interface";
import { GetReceiverCompaniesQuery } from "./get-receiver-companies.query";

@injectable()
export class GetReceiverCompaniesQueryHandler {
    constructor(
        @inject('IDBClient') private readonly dbClient: IDBClient
    ) {}

    async handle(command: GetReceiverCompaniesQuery): Promise<any[]> {

        const { rows } = await this.dbClient.query(`
            SELECT DISTINCT
                companies.cnpj,
                companies.business_name AS issuer
            FROM invoices
            INNER JOIN companies ON companies.cnpj  = invoices.recipient_cnpj
            WHERE invoices.issuer_cnpj = $1
        `, [command.issuerCnpj]);
    
        return rows
    }
}
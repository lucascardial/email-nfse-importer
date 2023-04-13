import { inject, injectable } from "inversify";
import { GetReceiverCompaniesQuery } from "./get-receiver-companies.query";
import { IDBConnection } from "../../../../infrastructure/database/connection/commom/db-connection.interface";

@injectable()
export class GetReceiverCompaniesQueryHandler {
    constructor(
        @inject('IDBConnection') private readonly dbConnection: IDBConnection
    ) {}

    async handle(command: GetReceiverCompaniesQuery): Promise<any[]> {

        const { rows } = await this.dbConnection.query(`
            SELECT DISTINCT
                companies.cnpj,
                concat(companies.business_name, ' (', companies.cnpj, ')')  AS issuer
            FROM invoices
            INNER JOIN companies ON companies.cnpj  = invoices.recipient_cnpj
            WHERE invoices.issuer_cnpj = $1
        `, [command.issuerCnpj]);
    
        return rows
    }
}
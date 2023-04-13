import { inject, injectable } from "inversify";
import { IDBConnection } from "../../../../infrastructure/database/connection/commom/db-connection.interface";

@injectable()
export class GetIssuerCompaniesQueryHandler {
  constructor(
    @inject("IDBConnection") private readonly dbConnection: IDBConnection
  ) {}

  async handle(): Promise<any[]> {
    const { rows } = await this.dbConnection.query(`
            SELECT DISTINCT
                issuer.cnpj,
                concat(issuer.business_name, ' (', issuer.cnpj, ')')  AS issuer
            FROM invoices
            INNER JOIN companies AS issuer ON issuer.cnpj  = invoices.issuer_cnpj
        `);

    return rows;
  }
}

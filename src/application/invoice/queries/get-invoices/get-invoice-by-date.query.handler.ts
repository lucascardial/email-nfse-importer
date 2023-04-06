import { inject, injectable } from "inversify";
import { Invoice } from "../../../../domain/entities";
import { IInvoiceRepository } from "../../../persistence";
import { GetInvoiceByDateQuery } from "./get-invoice-by-date.query";
import { IDBConnection } from "../../../../infrastructure/database/connection/commom/db-connection.interface";
import { IDBClient } from "../../../../infrastructure/database/connection/commom/db-client.interface";

@injectable()
export class GetInvoiceByDateQueryHandler {
  constructor(@inject("IDBClient") private readonly dbClient: IDBClient) {}

  async handle(query: GetInvoiceByDateQuery): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const date = query.date.toISOString().split("T")[0];

      const dateRange = [`${date} 00:00:00`, `${date} 23:59:59`];

      const { page = 1, limit = 20, cnpj: company } = query;

      const offset = (page - 1) * limit;

      let queryParams: any[] = [...dateRange];

      if (company) {
        queryParams.push(company);
      }

      // Consulta para obter o número total de resultados
      const totalQuery = await this.dbClient.query(
        `
            SELECT COUNT(DISTINCT companies.cnpj)
            FROM invoices
            INNER JOIN companies ON companies.cnpj = invoices.issuer_cnpj 
            WHERE created_at BETWEEN $1 AND $2
            ${
              company
                ? `AND companies.cnpj = $3`
                : " AND companies.cnpj IS NOT NULL"
            }
        `,
        [...queryParams]
      );

      const total = parseInt(totalQuery.rows[0].count);

      queryParams = [...dateRange, limit, offset];

      if (company) {
        queryParams.push(company);
      }

      const { rows } = await this.dbClient.query(
        `
            SELECT 
                companies.cnpj,
                companies.business_name,
                count(*) AS total
            FROM invoices
            INNER JOIN companies ON companies.cnpj = invoices.issuer_cnpj 
            WHERE 
                created_at BETWEEN $1 AND $2
                ${
                  company
                    ? `AND companies.cnpj = $5`
                    : " AND companies.cnpj IS NOT NULL"
                }
            GROUP BY companies.cnpj, companies.business_name 
            ORDER BY total DESC
            LIMIT $3
            OFFSET $4
        `,
        [...queryParams]
      );

      const lastPage = Math.ceil(total / limit);

      const data = {
        meta: {
          total,
          page,
          lastPage: lastPage,
          limit,
        },
        data: rows.map((row: any) => ({
          cnpj: row.cnpj,
          companyName: row.business_name,
          total: row.total,
          date: date,
        })),
      };

      setTimeout(() => {
        resolve(data);
      }, 2);
    });
  }
}

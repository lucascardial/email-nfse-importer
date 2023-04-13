import { inject, injectable } from "inversify";
import { GetInvoiceByDateQuery } from "./get-invoice-by-date.query";
import { IDBConnection } from "../../../../infrastructure/database/connection/commom/db-connection.interface";
import { IReportFileRepository } from "../../../persistence/report-file-repository.interface";

@injectable()
export class GetInvoiceByDateQueryHandler {
  constructor(
    @inject("IDBConnection") private readonly dbConnection: IDBConnection,
    @inject("IReportFileRepository") private readonly reportRepository: IReportFileRepository
    ) {}

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
      const totalQuery = await this.dbConnection.query(
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

      const { rows } = await this.dbConnection.query(
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
      const reports = await this.reportRepository.findByDate(query.date);

      const xmlReport = reports.find((report) => report.fileType === "xml");
      const csvReport = reports.find((report) => report.fileType === "csv");

      const data = {
        meta: {
          total,
          page,
          lastPage: lastPage,
          limit,
          xmlReport: xmlReport ? xmlReport.uid : null,
          csvReport: csvReport ? csvReport.uid : null,
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

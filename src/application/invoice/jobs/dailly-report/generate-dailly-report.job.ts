import xmlBuilder from "xmlbuilder";
import moment from "moment";
import { createObjectCsvWriter } from "csv-writer";
import { writeFileSync } from "fs";
import { inject, injectable } from "inversify";
import { DaillyInvoicesQueryResult } from "./types";
import { Cnpj } from "../../../../domain/object-values/cnpj";
import { IReportFileRepository } from "../../../persistence/report-file-repository.interface";
import { ReportFile } from "../../../../domain/entities/report-file";
import { SendDaillyReportToEmail } from "../../email/send-dailly-report.email";
import { JobExecutor } from "../common/job-executor.interface";
import { IDBConnection } from "../../../../infrastructure/database/connection/commom/db-connection.interface";

@injectable()
export class GenerateDaillyReportJob implements JobExecutor {
  constructor(
    @inject("IDBConnection")
      private readonly dbConnection: IDBConnection,
    @inject("IReportFileRepository")
      private readonly reportFileRepository: IReportFileRepository,
    @inject(SendDaillyReportToEmail)
      private readonly sendDaillyReportToEmail: SendDaillyReportToEmail
  ) {}

  async execute(now: Date): Promise<void> {
    const yersterday = new Date(now);
    yersterday.setDate(yersterday.getDate() - 1);

    const invoices = await this.getData(yersterday);
    await this.buildXml(invoices, yersterday);
    await this.buildSheet(invoices, yersterday);

    await this.sendDaillyReportToEmail.execute(yersterday);
  }

  private async buildSheet(
    invoices: DaillyInvoicesQueryResult[],
    date: Date
  ) {
    const humanDate = moment.utc(date).format("YYYY-MM-DD");

    const fileType = "csv";
    const fullPath = `reports/${humanDate}.${fileType}`;

    const csvWriter = createObjectCsvWriter({
      path: fullPath,
      header: [
        { id: "accessKey", title: "Chave de Acesso" },
        { id: "issuerCnpj", title: "CNPJ Emitente" },
        { id: "issuerName", title: "Nome Emitente" },
        { id: "receiverCnpj", title: "CNPJ Destinatário" },
        { id: "receiverName", title: "Nome Destinatário" },
        { id: "street", title: "Logradouro" },
        { id: "streetNumber", title: "Número" },
        { id: "neighborhood", title: "Bairro" },
        { id: "cityCode", title: "Código Município" },
        { id: "city", title: "Município" },
        { id: "state", title: "UF" },
        { id: "zipCode", title: "CEP" },
        { id: "phone", title: "Telefone" },
        { id: "quantity", title: "Quantidade" },
        { id: "grossWeight", title: "Peso Bruto" },
        { id: "totalValue", title: "Valor Total" },
        { id: "issueDate", title: "Data de Emissão" },
      ],
    });

    const csvData = invoices.map((invoice) => {
      return {
        accessKey: invoice.accessKey,
        issuerCnpj: invoice.issuerCnpj.toString(),
        issuerName: invoice.issuerName,
        receiverCnpj: invoice.receiverCnpj.toString(),
        receiverName: invoice.receiverName,
        street: invoice.street,
        streetNumber: invoice.streetNumber,
        neighborhood: invoice.neighborhood,
        cityCode: invoice.cityCode,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
        phone: invoice.phone,
        quantity: invoice.quantity,
        grossWeight: invoice.grossWeight,
        totalValue: invoice.totalValue,
        issueDate: moment.utc(invoice.issueDate).format("YYYY-MM-DD"),
      };
    });

    csvWriter
      .writeRecords(csvData)

    const reportFile = new ReportFile({
      fileName: `${humanDate}.${fileType}`,
      filePath: fullPath,
      fileType,
      createdAt: date,
    });

    await this.reportFileRepository.save(reportFile);
  }

  private async buildXml(
    invoices: DaillyInvoicesQueryResult[],
    date: Date
  ) {
    const humanDate = moment.utc(date).format("YYYY-MM-DD");

    const fileType = "xml";
    const fullPath = `reports/${humanDate}.${fileType}`;
    const xml = xmlBuilder.create("NFSes", { encoding: "utf-8" });

    xml.ele("DataReferencia").txt(humanDate).up();
    const xmlInvoices = xml.ele("Documentos");

    invoices.forEach((invoice) => {
      xmlInvoices
        .ele("NFSe")
        .ele("chNFe")
        .text(invoice.accessKey)
        .up()
        .ele("Emit")
        .ele("Cnpj")
        .txt(invoice.issuerCnpj.toString())
        .up()
        .ele("xNome")
        .txt("Empresa Emitente")
        .up()
        .up()
        .ele("Dest")
        .ele("Cnpj")
        .txt(invoice.receiverCnpj.toString())
        .up()
        .ele("xNome")
        .txt(invoice.receiverName)
        .up()
        .ele("enderDest")
        .ele("xLgr")
        .txt(invoice.street)
        .up()
        .ele("nro")
        .txt(invoice.streetNumber)
        .up()
        .ele("xBairro")
        .txt(invoice.neighborhood)
        .up()
        .ele("cMun")
        .txt(invoice.cityCode)
        .up()
        .ele("xMun")
        .txt(invoice.city)
        .up()
        .ele("UF")
        .txt(invoice.state)
        .up()
        .ele("CEP")
        .txt(invoice.zipCode)
        .up()
        .up()
        .ele("fone")
        .txt(invoice.phone)
        .up()
        .up()
        .ele("totais")
        .ele("vNF")
        .txt(invoice.totalValue.toString())
        .up()
        .ele("pesoB")
        .txt(invoice.grossWeight.toString())
        .up()
        .ele("qVol")
        .txt(invoice.quantity.toString())
        .up();
    });

    writeFileSync(fullPath, xml.end({ pretty: true }));

    const reportFile = new ReportFile({
      fileName: `${humanDate}.${fileType}`,
      filePath: fullPath,
      fileType,
      createdAt: date,
    });

    await this.reportFileRepository.save(reportFile);
  }

  private async getData(date: Date): Promise<DaillyInvoicesQueryResult[]> {
    const { rows } = await this.dbConnection.query(`
        SELECT 
            invoices.access_key,
            issuer.cnpj AS issuer_cnpj,
            issuer.business_name AS issuer_name,
            receiver.cnpj AS receiver_cnpj,
            receiver.business_name AS receiver_name,
            receiver.street,
            receiver.street_number,
            receiver.neighborhood,
            receiver.city_code,
            receiver.city,
            receiver.state,
            receiver.zip_code,
            receiver.phone,
            invoices.quantity,
            invoices.gross_weight,
            invoices.total_value,
            invoices.issue_date 
        FROM invoices
        INNER JOIN companies issuer ON issuer.cnpj = invoices.issuer_cnpj 
        INNER JOIN companies receiver ON receiver.cnpj = invoices.recipient_cnpj
        WHERE invoices.created_at between $1 AND $2
        `, [
          moment.utc(date).startOf("day").toISOString(),
          moment.utc(date).endOf("day").toISOString(),
        ]);

    return rows.map(
      (row: Record<string, never>): DaillyInvoicesQueryResult => ({
        accessKey: row.access_key,
        issuerCnpj: new Cnpj(row.issuer_cnpj),
        issuerName: row.issuer_name,
        receiverCnpj: new Cnpj(row.receiver_cnpj),
        receiverName: row.receiver_name,
        street: row.street,
        streetNumber: row.street_number,
        neighborhood: row.neighborhood,
        cityCode: row.city_code,
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
        phone: row.phone,
        quantity: row.quantity,
        grossWeight: row.gross_weight,
        totalValue: row.total_value,
        issueDate: row.issue_date,
      })
    );
  }
}

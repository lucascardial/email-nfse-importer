import { InvoiceXml } from "../../application/invoice/invoice-xml";

export class Invoice {
  constructor(
    public readonly accessKey: number,
    public readonly issuerCnpj: number,
    public readonly recipientCnpj: number,
    public readonly quantity: number,
    public readonly grossWeight: number,
    public readonly totalValue: number,
    public readonly issueDate: Date,
    public readonly createdAt: Date
  ) {}

  public static newFromJson(invoice: Record<string, any>): Invoice {
    return new Invoice(
      invoice.access_key,
      invoice.issuerCnpj,
      invoice.recipientCnpj,
      invoice.quantity,
      invoice.gross_weight,
      invoice.total_value,
      invoice.issue_date,
      invoice.created_at
    );
  }
}
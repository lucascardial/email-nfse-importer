import { Cnpj } from "../object-values/cnpj";

export class Invoice {
  constructor(
    public readonly accessKey: string,
    public readonly issuerCnpj: Cnpj,
    public readonly recipientCnpj: Cnpj,
    public readonly quantity: number,
    public readonly grossWeight: number,
    public readonly totalValue: number,
    public readonly issueDate: Date,
    public readonly createdAt: Date
  ) {}

  public static newFromJson(invoice: Record<string, any>): Invoice {
    return new Invoice(
      invoice.access_key,
      invoice.issuer_cnpj,
      invoice.recipient_cnpj,
      invoice.quantity,
      invoice.gross_weight,
      invoice.total_value,
      invoice.issue_date,
      invoice.created_at
    );
  }
}
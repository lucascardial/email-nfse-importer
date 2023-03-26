export class Invoice {
  constructor(
    public readonly access_key: string,
    public readonly sender_document_number: string,
    public readonly sender: string,
    public readonly recipient: string,
    public readonly recipient_document_number: string,
    public readonly recipient_address: string,
    public readonly recipient_phone: string,
    public readonly quantity: number,
    public readonly gross_weight: number,
    public readonly total_value: number,
    public readonly issue_date: Date,
    public readonly created_at: Date
  ) {}
}
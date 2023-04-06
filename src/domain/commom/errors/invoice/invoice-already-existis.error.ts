export class InvoiceAlreadyExistsError extends Error {
  constructor() {
    super('Invoice already exists');
  }
}
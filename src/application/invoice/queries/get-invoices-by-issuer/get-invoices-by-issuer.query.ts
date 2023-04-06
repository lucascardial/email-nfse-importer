export class GetInvoiceByIssuerQuery {
    constructor(
        public readonly date: Date,
        public readonly issuerCnpj: number,
        public page?: number,
        public receiverCnpj?: number,
        public limit?: number,
        public orderBy?: string,
    ) {}
}
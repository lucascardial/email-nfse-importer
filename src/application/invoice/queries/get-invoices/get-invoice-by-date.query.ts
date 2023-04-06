export class GetInvoiceByDateQuery {
    constructor(
        public date: Date,
        public page?: number,
        public cnpj?: number,
        public limit?: number,
        public orderBy?: string,
    ) {}
}
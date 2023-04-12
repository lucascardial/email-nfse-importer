export class ImportInvoiceFromXmlCommand {
    constructor(
        public xmlPath: string,
        public receivedAt: Date    
    ) {

    }
}
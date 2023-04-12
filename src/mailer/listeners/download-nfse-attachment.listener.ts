import { v4 } from "uuid";
import { writeFileSync } from "fs";
import { IMailListener, Mail } from "../../infrastructure/mailer/reader";
import { ImportInvoiceFromXmlCommand } from "../../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command";
import { inject, injectable } from "inversify";
import { ImportInvoiceFromXmlCommandHandler } from "../../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command-handler";

@injectable()
export class ImportNfseAttachmentListener implements IMailListener {

    constructor(
        @inject(ImportInvoiceFromXmlCommandHandler) private readonly handler: ImportInvoiceFromXmlCommandHandler
    ) {}

    async onMail(mail: Mail): Promise<void> {      
        for(const attachment of mail.attachments) {
            if(!attachment.mimeType.includes('xml')) continue;

            const buffer = Buffer.from(attachment.buffer);
            const filename = `downloads/${v4()}.xml`;

            writeFileSync(filename, buffer);
            const command = new ImportInvoiceFromXmlCommand(filename, new Date(mail.date));
            await this.handler.execute(command);
        }
    }
}
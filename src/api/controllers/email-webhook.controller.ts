import { injectable } from "inversify";
import { Request, Response } from "express";
import { ImportInvoiceFromXmlCommand } from "../../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command";
import { ImportInvoiceFromXmlCommandHandler } from "../../application/invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command-handler";
import { rootDir } from "../helpers";

@injectable()
export class EmailWebhookController {

    constructor(
        private readonly _importInvoiceFromEmailUseCase: ImportInvoiceFromXmlCommandHandler
     )
     { }
 
     async handle(request: Request, response: Response): Promise<Response> {
        const files: Express.Multer.File[] = JSON.parse(JSON.stringify(request.files));

        const xmlFiles = files.filter(file => {
            const extension = file.originalname.split('.').pop();     
            return extension === 'xml'
        });
        
        for(const xmlFile of xmlFiles) {
            const command = new ImportInvoiceFromXmlCommand(rootDir + '/../' +  xmlFile.path);
            await this._importInvoiceFromEmailUseCase.execute(command)
        }

         return response.status(200).send('ok');
     }
}
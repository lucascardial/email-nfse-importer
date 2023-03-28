import { Company, Invoice } from "../../../../domain/entities";
import { IXmlFileReader } from "../../../commom/services/xml-reader.interface";
import { IInvoiceRepository, ICompanyRepository } from "../../../persistence";
import { InvoiceXml } from "../../invoice-xml";
import { ImportInvoiceFromXmlCommand } from "./import-invoice-from-xml-command";

export class ImportInvoiceFromXmlCommandHandler {
    constructor(
        private readonly invoiceRepository: IInvoiceRepository,
        private readonly companyRepository: ICompanyRepository,
        private readonly xmlReader: IXmlFileReader,
    ) { }

    async execute(command: ImportInvoiceFromXmlCommand): Promise<void> {
        const data = await this.xmlReader.read<InvoiceXml>(command.xmlPath);

        const accessKey = data.nfeProc.protNFe.infProt.chNFe;

        const invoiceExists = await this.invoiceRepository.findByAccessKey(accessKey);
        if (invoiceExists) {
            throw new Error("Invoice already exists");
        }
        
        // Get or Create Company Issuer
        let companyIssuer = await this.companyRepository.findByCnpj(data.nfeProc.NFe.infNFe.emit.CNPJ);
        if(!companyIssuer) {
            companyIssuer = Company.newFromJson({
                cnpj: data.nfeProc.NFe.infNFe.emit.CNPJ,
                facadeName: data.nfeProc.NFe.infNFe.emit.xFant,
                businessName: data.nfeProc.NFe.infNFe.emit.xNome,
                stateNumberInscrition: data.nfeProc.NFe.infNFe.emit.IE,
                ctrNumber: data.nfeProc.NFe.infNFe.emit.CRT,
                street: data.nfeProc.NFe.infNFe.emit.enderEmit.xLgr,
                streetNumber: data.nfeProc.NFe.infNFe.emit.enderEmit.nro,
                neighborhood: data.nfeProc.NFe.infNFe.emit.enderEmit.xBairro,
                cityCode: data.nfeProc.NFe.infNFe.emit.enderEmit.cMun,
                city: data.nfeProc.NFe.infNFe.emit.enderEmit.xMun,
                state: data.nfeProc.NFe.infNFe.emit.enderEmit.UF,
                zipCode: data.nfeProc.NFe.infNFe.emit.enderEmit.CEP,
                phone: data.nfeProc.NFe.infNFe.emit.enderEmit.fone
            });

            await this.companyRepository.save(companyIssuer);
        }
        
        // Get or Create Company Receiver
        let companyReceiver = await this.companyRepository.findByCnpj(data.nfeProc.NFe.infNFe.dest.CNPJ);
        if(!companyReceiver) {
            companyReceiver = Company.newFromJson({
                cnpj: data.nfeProc.NFe.infNFe.dest.CNPJ,
                facadeName: data.nfeProc.NFe.infNFe.dest.xNome,
                businessName: data.nfeProc.NFe.infNFe.dest.xNome,
                stateNumberInscrition: data.nfeProc.NFe.infNFe.dest.IE,
                street: data.nfeProc.NFe.infNFe.dest.enderDest.xLgr,
                streetNumber: data.nfeProc.NFe.infNFe.dest.enderDest.nro,
                neighborhood: data.nfeProc.NFe.infNFe.dest.enderDest.xBairro,
                cityCode: data.nfeProc.NFe.infNFe.dest.enderDest.cMun,
                city: data.nfeProc.NFe.infNFe.dest.enderDest.xMun,
                state: data.nfeProc.NFe.infNFe.dest.enderDest.UF,
                zipCode: data.nfeProc.NFe.infNFe.dest.enderDest.CEP,
                phone: data.nfeProc.NFe.infNFe.dest.enderDest.fone
            });

            await this.companyRepository.save(companyReceiver);
        }

        // Create Invoice
        const invoice = Invoice.newFromJson({
            access_key: accessKey,
            issuerCnpj: companyIssuer.cnpj,
            recipientCnpj: companyReceiver.cnpj,
            quantity: data.nfeProc.NFe.infNFe.transp.vol.qVol,
            gross_weight: data.nfeProc.NFe.infNFe.transp.vol.pesoL,
            total_value: data.nfeProc.NFe.infNFe.total.ICMSTot.vNF,
            issue_date: data.nfeProc.NFe.infNFe.ide.dhEmi,
            created_at: new Date()
        })

        await this.invoiceRepository.save(invoice);
    }

}
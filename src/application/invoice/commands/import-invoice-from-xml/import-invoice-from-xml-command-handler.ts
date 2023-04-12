import { inject, injectable } from "inversify";
import { Company, Invoice, InvoiceError } from "../../../../domain/entities";
import { InvoiceAlreadyExistsError } from "../../../../domain/commom/errors/invoice/invoice-already-existis.error";
import { ErrorOr, left, right } from "../../../../lib/error-or/error-or.interface";
import { IXmlFileReader } from "../../../commom/services/xml-reader.interface";
import { IInvoiceRepository, ICompanyRepository, IInvoiceErrorRepository } from "../../../persistence";
import { InvoiceXml } from "../../invoice-xml";
import { ImportInvoiceFromXmlCommand } from "./import-invoice-from-xml-command";
import { ValidateXml } from "./validate-xml";

@injectable()
export class ImportInvoiceFromXmlCommandHandler {
    constructor(
        @inject('IInvoiceRepository') private readonly invoiceRepository: IInvoiceRepository,
        @inject('ICompanyRepository') private readonly companyRepository: ICompanyRepository,
        @inject('IInvoiceErrorRepository') private readonly invoiceErrorRepository: IInvoiceErrorRepository,
        @inject('IXmlFileReader') private readonly xmlReader: IXmlFileReader,
    ) { }

    async execute(command: ImportInvoiceFromXmlCommand): Promise<ErrorOr<void>> {
        const data = await this.xmlReader.read<InvoiceXml>(command.xmlPath);

        const validateXml = ValidateXml.validate(data);

        if(validateXml) {
            await this.invoiceErrorRepository.save(new InvoiceError(this.getFileName(command.xmlPath), JSON.stringify(validateXml)));
            return left(validateXml);
        }

        const accessKey = data.nfeProc.protNFe.infProt.chNFe;

        const invoiceExists = await this.invoiceRepository.findByAccessKey(accessKey);
        
        if (invoiceExists) {
            return left(new InvoiceAlreadyExistsError());
        }
        
        // Get or Create Company Issuer
        let companyIssuer = await this.companyRepository.findByCnpj(data.nfeProc.NFe.infNFe.emit.CNPJ);
        
        if(!companyIssuer) {
            companyIssuer = Company.newFromJson({
                cnpj: data.nfeProc.NFe.infNFe.emit.CNPJ,
                facade_name: data.nfeProc.NFe.infNFe.emit.xFant,
                business_name: data.nfeProc.NFe.infNFe.emit.xNome,
                state_number_inscription: data.nfeProc.NFe.infNFe.emit.IE,
                ctr_number: data.nfeProc.NFe.infNFe.emit.CRT,
                street: data.nfeProc.NFe.infNFe.emit.enderEmit.xLgr,
                street_number: data.nfeProc.NFe.infNFe.emit.enderEmit.nro,
                neighborhood: data.nfeProc.NFe.infNFe.emit.enderEmit.xBairro,
                city_code: data.nfeProc.NFe.infNFe.emit.enderEmit.cMun,
                city: data.nfeProc.NFe.infNFe.emit.enderEmit.xMun,
                state: data.nfeProc.NFe.infNFe.emit.enderEmit.UF,
                zip_code: data.nfeProc.NFe.infNFe.emit.enderEmit.CEP,
                phone: data.nfeProc.NFe.infNFe.emit.enderEmit.fone
            });
            await this.companyRepository.save(companyIssuer);
        
        }
        
        // Get or Create Company Receiver
        let companyReceiver = await this.companyRepository.findByCnpj(data.nfeProc.NFe.infNFe.dest.CNPJ);
        if(!companyReceiver) {
            companyReceiver = Company.newFromJson({
                cnpj: data.nfeProc.NFe.infNFe.dest.CNPJ,
                facade_name: data.nfeProc.NFe.infNFe.dest.xNome,
                business_name: data.nfeProc.NFe.infNFe.dest.xNome,
                state_number_inscription: data.nfeProc.NFe.infNFe.dest.IE,
                street: data.nfeProc.NFe.infNFe.dest.enderDest.xLgr,
                street_number: data.nfeProc.NFe.infNFe.dest.enderDest.nro,
                neighborhood: data.nfeProc.NFe.infNFe.dest.enderDest.xBairro,
                city_code: data.nfeProc.NFe.infNFe.dest.enderDest.cMun,
                city: data.nfeProc.NFe.infNFe.dest.enderDest.xMun,
                state: data.nfeProc.NFe.infNFe.dest.enderDest.UF,
                zip_code: data.nfeProc.NFe.infNFe.dest.enderDest.CEP,
                phone: data.nfeProc.NFe.infNFe.dest.enderDest.fone
            });

            await this.companyRepository.save(companyReceiver);
        }

        // Create Invoice
        const invoice = Invoice.newFromJson({
            access_key: accessKey.toString(),
            issuer_cnpj: companyIssuer.cnpj,
            recipient_cnpj: companyReceiver.cnpj,
            quantity: data.nfeProc.NFe.infNFe.transp.vol.qVol ?? 1,
            gross_weight: data.nfeProc.NFe.infNFe.transp.vol.pesoB,
            total_value: data.nfeProc.NFe.infNFe.total.ICMSTot.vNF,
            issue_date: data.nfeProc.NFe.infNFe.ide.dhEmi,
            created_at: command.receivedAt
        })

        await this.invoiceRepository.save(invoice);

        return right()
    }

    private getFileName(xmlPath:string) {
        return xmlPath.split('/').pop() ?? '';
    }
}
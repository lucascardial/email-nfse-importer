import { Invoice } from "../../../domain/entities";

export interface IXmlToInvoiceMapper {
    map(xmlObject: object): Promise<Invoice>;
}
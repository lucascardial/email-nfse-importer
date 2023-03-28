import { InvoiceXml } from "../../invoice/invoice-xml";

export interface IXmlParser<T> {
    parse(xml: InvoiceXml): Promise<T>;
}
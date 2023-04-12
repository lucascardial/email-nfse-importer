import { InvalidXmlError } from "../../../../domain/commom/errors/invoice/invalid-xml.error";

export class ValidateXml {

    /**
     * Must validate if the xlm contains all property passed in the schema
     * @param xmlObject 
     */
    public static validate(xmlObject: Record<string, unknown>): InvalidXmlError | undefined {
        const requiredFields = this.requiredFields();
        const fields = this.getFields(xmlObject);
        const missingFields = requiredFields.filter(requiredField => !fields.includes(requiredField));

        if(missingFields.length > 0) {
            return new InvalidXmlError(missingFields)
        }
    }
    
    private static getFields(xmlObject: any, parentKey = ''): string[] {
        return Object.keys(xmlObject).reduce((fields: string[], key: string) => {
            const value = xmlObject[key];
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof value === 'object') {
                return [...fields, ...this.getFields(value, newKey)];
            }

            return [...fields, newKey];
        }, []);
    }

    private static requiredFields(): string[] {
        return [
            'nfeProc.protNFe.infProt.chNFe',
            'nfeProc.NFe.infNFe.emit.CNPJ',
            'nfeProc.NFe.infNFe.emit.xFant',
            'nfeProc.NFe.infNFe.emit.xNome',
            'nfeProc.NFe.infNFe.emit.IE',
            'nfeProc.NFe.infNFe.emit.CRT',
            'nfeProc.NFe.infNFe.emit.enderEmit.xLgr',
            'nfeProc.NFe.infNFe.emit.enderEmit.nro',
            'nfeProc.NFe.infNFe.emit.enderEmit.xBairro',
            'nfeProc.NFe.infNFe.emit.enderEmit.cMun',
            'nfeProc.NFe.infNFe.emit.enderEmit.xMun',
            'nfeProc.NFe.infNFe.emit.enderEmit.UF',
            'nfeProc.NFe.infNFe.emit.enderEmit.CEP',
            'nfeProc.NFe.infNFe.emit.enderEmit.fone',
            'nfeProc.NFe.infNFe.dest.CNPJ',
            'nfeProc.NFe.infNFe.dest.xNome',
            'nfeProc.NFe.infNFe.dest.IE',
            'nfeProc.NFe.infNFe.dest.enderDest.xLgr',
            'nfeProc.NFe.infNFe.dest.enderDest.nro',
            'nfeProc.NFe.infNFe.dest.enderDest.xBairro',
            'nfeProc.NFe.infNFe.dest.enderDest.cMun',
            'nfeProc.NFe.infNFe.dest.enderDest.xMun',
            'nfeProc.NFe.infNFe.dest.enderDest.UF',
            'nfeProc.NFe.infNFe.dest.enderDest.CEP',
            'nfeProc.NFe.infNFe.dest.enderDest.fone',
            'nfeProc.NFe.infNFe.transp.vol.pesoL',
            'nfeProc.NFe.infNFe.total.ICMSTot.vNF',
            'nfeProc.NFe.infNFe.ide.dhEmi'
        ]
    }
}
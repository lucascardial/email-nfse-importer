import { readFileSync } from 'fs'
import { parseString } from 'xml2js'
import { IXmlFileReader } from "../../../application/commom/services";
import { injectable } from 'inversify';

@injectable()
export class XmlFileReader implements IXmlFileReader {
    async read<T = object>(path: string): Promise<T> {
        return new Promise((resolve, reject) => {
            const xml = readFileSync(path, 'utf-8');
            parseString(xml, { explicitArray: false } ,(err, result) => {
                if (err) {
                    reject(err);
                } else {                    
                    resolve(result);
                }
            });
        });
    }
}
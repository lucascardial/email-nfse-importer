import { inject, injectable } from "inversify";
import { IInvoiceErrorRepository } from "../../../application/persistence";
import { InvoiceError } from "../../../domain/entities";
import { IDBClient } from "../connection/commom/db-client.interface";
import { IDBConnection } from "../connection/commom/db-connection.interface";

@injectable()
export class InvoiceErrorRepository implements IInvoiceErrorRepository{
    private readonly dbClient: IDBClient;

    constructor(
        @inject('IDBConnection') dbConnection: IDBConnection
    ) {
        this.dbClient = dbConnection.getConnection();
    }
    
    async save(invoice_error: InvoiceError): Promise<void> {
        await this.dbClient.query(`
            INSERT INTO invoice_errors (
                file_name,
                errors
            ) VALUES (
                $1,
                $2
            )`, [
                invoice_error.fileName,
                invoice_error.errorJson
            ]
        );
    }

    async findByFileName(fileName: string): Promise<InvoiceError | undefined> {
       const result = await this.dbClient.query(`
            SELECT * FROM invoice_errors WHERE file_name = $1
        `, [fileName]);

        if(result.rows.length === 0) {
            return undefined;
        }

        return new InvoiceError(
            result.rows[0].file_name,
            result.rows[0].error_message
        );
    }

    async findAll(): Promise<InvoiceError[]> {
        const { rows } = await this.dbClient.query(`
            SELECT * FROM invoice_errors
        `);

        return rows.map((row: any) => new InvoiceError(
            row.file_name,
            JSON.stringify(row.errors)
        ));
    }
    
}
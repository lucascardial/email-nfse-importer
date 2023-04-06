import { inject, injectable } from "inversify";
import { IDBClient } from "./commom/db-client.interface";
import { IDBConnection } from "./commom/db-connection.interface";

@injectable()
export class DbClient implements IDBClient {
    private readonly client: IDBClient;

    constructor(
        @inject('IDBConnection') dbConnection: IDBConnection
    ){
        this.client = dbConnection.getConnection();
    }

    query(query: string, values?: any[] | undefined): Promise<any> {
        return this.client.query(query, values);
    }
}
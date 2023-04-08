import { IDBClient } from "./commom/db-client.interface";
import { IDBConnection } from "./commom/db-connection.interface";
import { Pool, QueryResult } from "pg";
import { injectable } from "inversify";

@injectable()
export class PostgresConnection implements IDBConnection {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
    }

    async connect(): Promise<void> {
        await this.pool.connect()
    }

    async disconnect(): Promise<void> {
        this.pool.end();
    }

    getConnection(): IDBClient {
        const client = this.pool.connect();

        return {
            query: async (query: string, values?: any[]): Promise<QueryResult<any>> => {
                return (await client).query(query, values);
            }
        }
    }
}
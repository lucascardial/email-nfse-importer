import { IDBClient } from "./commom/db-client.interface";
import { IDBConnection } from "./commom/db-connection.interface";
import { Pool, PoolClient, QueryResult } from "pg";
import { injectable } from "inversify";

@injectable()
export class PostgresConnection implements IDBConnection {
    private pool: Pool;
    private client?: PoolClient;

    constructor() {
        console.log("PostgresConnection: constructor");
        
        const ssl = process.env.DB_SSL ? { rejectUnauthorized: false } : false;

        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT!),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl
        });
    }
    
    async connect(): Promise<void> {
        try {
            if(!this.client) {
                this.client = await this.pool.connect();
            }
        } catch (error) {
            throw new Error(`Error connecting to Postgres: ${error}`);
        }
    }

    async dispose(): Promise<void> {
        if (!this.client) {
            throw new Error("PostgresConnection: client not connected");
        }
        await this.client.release();
    }

    async query(query: string, values?: any[] | undefined): Promise<QueryResult> {
        return this.pool.query(query, values);
    }

    async beginTransaction(): Promise<void> {
        if (!this.client) {
            throw new Error("PostgresConnection: client not connected");
        }
        await this.client.query("BEGIN");
    }

    async commitTransaction(): Promise<void> {
        if (!this.client) {
            throw new Error("PostgresConnection: client not connected");
        }
        await this.client.query("COMMIT");
    }

    async rollbackTransaction(): Promise<void> {
        if (!this.client) {
            throw new Error("PostgresConnection: client not connected");
        }
        await this.client.query("ROLLBACK");
    }

    async executeInTransaction(fn: (connection: IDBClient) => Promise<any>): Promise<any> {
        if (!this.client) {
            throw new Error("PostgresConnection: client not connected");
        }
        let result;
        await this.beginTransaction();
        try {
            result = await fn(this);
            await this.commitTransaction();
        } catch (error) {
            await this.rollbackTransaction();
            throw error;
        }
        return result;
    }
}

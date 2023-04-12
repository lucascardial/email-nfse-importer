import { IDBClient } from "./db-client.interface";

export interface IDBConnection {
    connect(): Promise<void>;
    query(query: string, values?: any[]): Promise<any>;
    dispose(): Promise<void>;
}
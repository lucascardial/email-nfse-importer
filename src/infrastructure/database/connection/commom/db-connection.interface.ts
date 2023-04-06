import { IDBClient } from "./db-client.interface";

export interface IDBConnection {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getConnection(): IDBClient;
}
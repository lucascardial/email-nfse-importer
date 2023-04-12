export interface IDBClient {
    query(query: string, values?: any[]): Promise<any>;
    dispose(): Promise<void>;
}
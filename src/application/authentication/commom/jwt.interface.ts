export interface IJwt {
    sign(payload: any, options?: any): Promise<string>;
    verify(token: string, options?: any): Promise<any>;
}
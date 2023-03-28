export interface IXmlFileReader {
    read<T = object>(path: string): Promise<T>;
}
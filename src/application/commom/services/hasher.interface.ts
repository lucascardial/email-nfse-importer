export interface IHasher {
    hash(plaintext: string): Promise<string>;
    compare(plaintext: string, digest: string): Promise<boolean>;
}
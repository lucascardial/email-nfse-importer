export class Cnpj {
    constructor(
        private readonly value: number
    ) {}

    toString(): string {
        const cnpj = this.value.toString().padStart(14, '0');
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
    }

    getCnpj(): number {
        return this.value;
    }
}
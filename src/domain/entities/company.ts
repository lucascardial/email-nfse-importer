export class Company {
    constructor(
        public readonly cnpj: number,
        public readonly facadeName: string,
        public readonly businessName: string,
        public readonly stateNumberInscrition: number,
        public readonly ctrNumber: number,
        public readonly street: string,
        public readonly streetNumber: number,
        public readonly neighborhood: string,
        public readonly cityCode: number,
        public readonly city: string,
        public readonly state: string,
        public readonly zipCode: number,
        public readonly phone: number,
        public readonly email?: string
    ) {}

    public static newFromJson(company: Record<string, any>): Company {
        return new Company(
            company.cnpj,
            company.facadeName,
            company.businessName,
            company.stateNumberInscrition,
            company.ctrNumber,
            company.street,
            company.streetNumber,
            company.neighborhood,
            company.cityCode,
            company.city,
            company.state,
            company.zipCode,
            company.phone,
            company.email
        );
    }
}
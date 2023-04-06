import { Cnpj } from "../object-values/cnpj";

export class Company {
    constructor(
        public readonly cnpj: Cnpj,
        public readonly facadeName: string,
        public readonly businessName: string,
        public readonly stateNumberInscription: number,
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
            new Cnpj(company.cnpj),
            company.facade_name,
            company.business_name,
            company.state_number_inscription,
            company.ctr_number,
            company.street,
            company.street_number,
            company.neighborhood,
            company.city_code,
            company.city,
            company.state,
            company.zip_code,
            company.phone,
            company.email
        );
    }
}
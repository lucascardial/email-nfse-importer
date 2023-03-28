import { Company } from "../../domain/entities";

export interface ICompanyRepository {
    save(company: Company): Promise<void>;
    findByCnpj(cnpj: number): Promise<Company | undefined>;
}
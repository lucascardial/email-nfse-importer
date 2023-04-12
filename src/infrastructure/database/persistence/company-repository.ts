import { injectable, inject } from "inversify";
import { ICompanyRepository } from "../../../application/persistence";
import { Company } from "../../../domain/entities";
import { IDBConnection } from "../connection/commom/db-connection.interface";

@injectable()
export class CompanyRepository implements ICompanyRepository {
    constructor(
        @inject('IDBConnection')  private readonly dbConnection: IDBConnection
    ) {
    }

    async save(company: Company): Promise<void> {    
        await this.dbConnection.query(`
            INSERT INTO companies (
                cnpj,
                facade_name,
                business_name,
                state_number_inscription,
                crt,
                street,
                street_number,
                neighborhood,
                city_code,
                city,
                state,
                zip_code,
                phone,
                email
            ) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14
            )`, [
                company.cnpj.getCnpj(),
                company.facadeName,
                company.businessName,
                company.stateNumberInscription,
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
            ]);
    }

    async findByCnpj(cnpj: number): Promise<Company | undefined> {
        cnpj = parseInt(cnpj.toString(), 10)

        const { rows, rowCount } = await this.dbConnection.query(`
            SELECT * FROM companies WHERE cnpj = $1
        `, [cnpj]);

        
        
        if (!rowCount) {
            return undefined;
        }
        
        return Company.newFromJson(rows[0]);
    }
}
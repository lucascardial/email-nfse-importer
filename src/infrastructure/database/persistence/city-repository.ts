import { inject, injectable } from "inversify";
import { ICityRepostory } from "../../../application/persistence/city-repository.interface";
import { City } from "../../../domain/entities/city";
import { IDBConnection } from "../connection/commom/db-connection.interface";

@injectable()
export class CityRepository implements ICityRepostory {
    constructor(
        @inject('IDBConnection') private readonly dbConnection: IDBConnection
    ) { }

    async getByIbgeCode(ibgeCode: number): Promise<City> {
        return this.dbConnection.query(`
            SELECT * FROM cities WHERE code = $1
        `, [ibgeCode])
        .then(result => result.rows.map((row: Record<string, never>) => City.fromJSON({
            code: row.code,
            name: row.name,
            stateInitials: row.uf
        })));

    }

    async getByNameContaining(name: string): Promise<City[]> {
        return this.dbConnection.query(`
            SELECT * FROM cities WHERE unaccent(name) ILIKE unaccent($1)
            ORDER BY name
        `, [`%${name}%`])
        .then(result => result.rows.map((row: Record<string, never>) => City.fromJSON({
            code: row.code,
            name: row.name,
            stateInitials: row.uf
        })));
    }

}
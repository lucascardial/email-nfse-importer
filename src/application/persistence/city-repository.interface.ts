import { City } from "../../domain/entities/city";

export interface ICityRepostory {
    getByIbgeCode(ibgeCode: number): Promise<City>;
    getByNameContaining(name: string): Promise<City[]>;
}
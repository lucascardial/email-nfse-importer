import { inject, injectable } from "inversify";
import { IRouteRepository } from "../../../persistence";
import { Route } from "../../../../domain/entities/route";
import { IDBConnection } from "../../../../infrastructure/database/connection/commom/db-connection.interface";
import { TupleResult } from "./get-routes.query-result";


@injectable()
export class GetRoutesQueryHandler {
    constructor(
        @inject('IDBConnection') private readonly dbConnection: IDBConnection,
    ) { }

    public async handle(): Promise<any> {

        const tupleResult: TupleResult[] = [];
        const tuples = new Map<string, TupleResult>();


        const { rows } = await this
            .dbConnection
            .query(`
            SELECT
                routes.id AS route_uid,
                routes.name AS route_name,
                c.code AS city_code,
                c.name AS city_name
            FROM routes 
            LEFT JOIN route_cities rc ON rc.route_id = routes.id 
            LEFT JOIN cities c ON c.code = rc.city_code
            ORDER BY routes.name
            `)
            
        rows.forEach((row: Record<string, never>) => {
            const { route_uid, route_name, city_code, city_name } = row;
            if (!tuples.has(route_uid)) {
              const tuple: TupleResult = {
                uid: route_uid,
                name: route_name,
                cities: [],
              };
              tuples.set(route_uid, tuple);
              tupleResult.push(tuple);
            }
            
            if(city_code && city_name) {
                const city = { code: city_code, name: city_name };
                tuples.get(route_uid)?.cities.push(city);
            }
          });

          console.log(tupleResult);
          
          return tupleResult
    }
}
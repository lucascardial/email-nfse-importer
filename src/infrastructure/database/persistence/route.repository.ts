import { inject, injectable } from "inversify";
import { IRouteRepository } from "../../../application/persistence";
import { Route } from "../../../domain/entities/route";
import { IDBConnection } from "../connection/commom/db-connection.interface";

@injectable()
export class RouteRepository implements IRouteRepository {
    constructor(
        @inject("IDBConnection") private readonly dbConnection: IDBConnection,
    ){}

    async findRouteByName(name: string): Promise<Route | null> {
        return this.
            dbConnection
            .query(
                "SELECT * FROM routes WHERE unaccent(lower(name)) = unaccent(lower($1));",
                [name]
            ).then((result) => {
                if(result.rowCount === 0) {
                    return null;
                }
                return Route.fromJSON(result.rows[0]);
            });
    }

    async getRoutes(): Promise<Route[]> {
        return  this
            .dbConnection
            .query(
                "SELECT * FROM routes WHERE id"
            ).then((result) => {
                return result.rows.map((row: Record<string, never>) => {
                    return Route.fromJSON(row);
                });
            });
    }

    async createRoute(route: Route): Promise<void> {
        await this
        .dbConnection
        .query(
            "INSERT INTO routes (id, name) VALUES ($1, $2)",
            [route.uid, route.name]
        );
    }

    async deleteRoute(uid: string): Promise<void> {
        await this
            .dbConnection
            .query(
                "DELETE FROM routes WHERE id = $1",
                [uid]
            );
    }

    async addCity(routeUid: string, cityCode: number): Promise<void> {
        await this
            .dbConnection
            .query(
                "INSERT INTO route_cities (route_id, city_code) VALUES ($1, $2)",
                [routeUid, cityCode]
            );
    }

    async removeCity(routeUid: string, cityCode: number): Promise<void> {
        await this
            .dbConnection
            .query(
                "DELETE FROM route_cities WHERE route_id = $1 AND city_code = $2",
                [routeUid, cityCode]
            );
    }

    async findRouteByCity(cityCode: number): Promise<Route | null> {
        return this
            .dbConnection
            .query(
                "SELECT * FROM routes WHERE id IN (SELECT route_id FROM route_cities WHERE city_code = $1)",
                [cityCode]
            ).then((result) => {
                if(result.rowCount === 0) {
                    return null;
                }
                return Route.fromJSON(result.rows[0]);
            }
        );
    }
    
}
import { Route } from "../../domain/entities/route";

export interface IRouteRepository {
    getRoutes(): Promise<Route[]>;
    createRoute(route: Route): Promise<void>;
    deleteRoute(uid: string): Promise<void>;
    findRouteByName(name: string): Promise<Route | null>;

    addCity(routeUid: string, cityCode: number): Promise<void>;
    removeCity(routeUid: string, cityCode: number): Promise<void>;
    findRouteByCity(cityCode: number): Promise<Route | null>;

}
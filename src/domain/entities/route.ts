export class Route {
    public uid!: string;
    public name!: string;

    static fromJSON(json: any): Route {
        const route = new Route();
        route.uid = json.uid;
        route.name = json.name;
        return route;
    }
}
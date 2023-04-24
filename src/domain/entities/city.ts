export class City {
    public code!: string;
    public name!: string;
    public stateInitials!: string;

    static fromJSON(json: any): City {
        const city = new City();
        Object.assign(city, json);
        return city;
    }
}
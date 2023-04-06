export class User {
    constructor(
        public readonly login: string,
        public readonly password: string,
    ){}

    public static newFromJson(json: any): User {
        return new User(
            json.login,
            json.password,
        );
    }
}
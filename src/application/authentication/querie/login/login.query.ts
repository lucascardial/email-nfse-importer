export class LoginQuery {
    constructor(
        public readonly login: string,
        public readonly password: string,
    ) {}
}
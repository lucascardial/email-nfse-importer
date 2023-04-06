export class RegisterCommand {
    constructor(
        public readonly login: string,
        public readonly password: string,
    ) {}
}
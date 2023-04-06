export class UserAlreadyExistsError extends Error {
    constructor() {
        super('user already exists');
    }
}
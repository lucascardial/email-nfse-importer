import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../application/persistence/user.repository";
import { User } from "../../../domain/entities";
import { IDBClient } from "../connection/commom/db-client.interface";
import { IDBConnection } from "../connection/commom/db-connection.interface";

@injectable()
export class UserRepository implements IUserRepository {
    private readonly dbClient: IDBClient;

    constructor(
        @inject('IDBConnection') dbConnection: IDBConnection
    ){
        this.dbClient = dbConnection.getConnection();
    }

    async save(user: User): Promise<void> {
        await this.dbClient.query(`
            INSERT INTO users (
                login,
                password
            ) VALUES ($1,$2)`, 
            [user.login, user.password]);
    }

    async findByLogin(login: string): Promise<User | undefined> {
        const { rows } = await this.dbClient.query(`
            SELECT * FROM users WHERE login = $1`, [login]);

        if (!rows[0]) {
            return undefined;
        }

        return new User(rows[0].login, rows[0].password);
    }

    async findAll(): Promise<User[]> {
        const { rows } = await this.dbClient
        .query(`SELECT * FROM users`);

        return rows.map((row: any) => new User(row.login, row.password));
    }

}
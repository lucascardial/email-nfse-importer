import { User } from "../../domain/entities/user";

export interface IUserRepository {
    save(user: User): Promise<void>;
    findByLogin(login: string): Promise<User | undefined>;
    findAll(): Promise<User[]>;
}
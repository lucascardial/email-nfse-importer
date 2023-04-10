import 'reflect-metadata'
import { Container } from "inversify";
import "../application/dependency-injection";
import "../infrastructure/dependency-injection";

export default new Container().addApplication().addInfrastructure()


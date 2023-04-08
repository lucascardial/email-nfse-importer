import 'reflect-metadata'
import { Container } from "inversify";
import * as dotenv from 'dotenv'; 
import "../application/dependency-injection";
import "../infrastructure/dependency-injection";
dotenv.config()
export default new Container().addApplication().addInfrastructure()


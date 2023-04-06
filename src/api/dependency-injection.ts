import { Container } from "inversify";
import "../infrastructure/dependency-injection";
import "../application/dependency-injection";

const container = new Container()

container
    .addInfrastructure()
    .addApplication();

export { container }
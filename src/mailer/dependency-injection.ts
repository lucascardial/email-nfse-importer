import "reflect-metadata"
import { Container } from "inversify";
import "../application/dependency-injection";
import "../infrastructure/dependency-injection";
import { ImportNfseAttachmentListener } from "./listeners/download-nfse-attachment.listener";

const container = new Container().addApplication().addInfrastructure();

container.bind(ImportNfseAttachmentListener).toSelf().inSingletonScope();

export { container }
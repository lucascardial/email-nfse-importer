import { Container } from "inversify";
import { ICompanyRepository, IInvoiceErrorRepository, IInvoiceRepository } from "../application/persistence";
import { InvoiceRepository, CompanyRepository, InvoiceErrorRepository } from "./database/persistence";
import { IXmlFileReader } from "../application/commom/services";
import { XmlFileReader } from "./file-reader/xml/xml-file-reader";
import { IDBConnection } from "./database/connection/commom/db-connection.interface";
import { PostgresConnection } from "./database/connection/postgres-connection";
import { BcryptAdapter } from "./hasher/bcript-adaptor";
import { IHasher } from "../application/commom/services/hasher.interface";
import { IUserRepository } from "../application/persistence/user.repository";
import { UserRepository } from "./database/persistence/user.repository";
import { JwtService } from "./jwt/jwt-service";
import { IJwt } from "../application/authentication/commom/jwt.interface";
import { DbClient } from "./database/connection/db-client";
import { IDBClient } from "./database/connection/commom/db-client.interface";

declare module "inversify" {
    interface Container {
      addInfrastructure(): this;
    }
  }

Container.prototype.addInfrastructure = function() {
    this.bind<IDBConnection>('IDBConnection').to(PostgresConnection);
    this.bind<IDBClient>('IDBClient').to(DbClient).inSingletonScope();
    
    this.bind<IInvoiceRepository>('IInvoiceRepository').to(InvoiceRepository);
    this.bind<ICompanyRepository>('ICompanyRepository').to(CompanyRepository);
    this.bind<IInvoiceErrorRepository>('IInvoiceErrorRepository').to(InvoiceErrorRepository);
    this.bind<IUserRepository>('IUserRepository').to(UserRepository);

    this.bind<IJwt>('IJwt').to(JwtService);
    this.bind<IXmlFileReader>('IXmlFileReader').to(XmlFileReader);
    this.bind<IHasher>('IHasher').to(BcryptAdapter);
    
    return this;
}
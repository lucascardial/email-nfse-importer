import { Container } from "inversify";
import { ImportInvoiceFromXmlCommandHandler } from "./invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command-handler";
import { GetInvoiceErrorsQuery } from "./invoice/queries/get-invoice-errors/get-invoice-errors.query";
import { GetInvoiceByDateQueryHandler } from "./invoice/queries/get-invoices/get-invoice-by-date.query.handler";
import { GetInvoiceByIssuerQueryHandler } from "./invoice/queries/get-invoices-by-issuer/get-invoices-by-issuer.query-handler";
import { RegisterCommandHandler } from "./authentication/command/register/register.command.handler";
import { LoginQueryHandler } from "./authentication/querie/login/login.query.handler";
import { GetIssuerCompaniesQueryHandler } from "./invoice/queries/get-issuer-companies/get-issuer-companies.query.handler";
import { GetReceiverCompaniesQueryHandler } from "./invoice/queries/get-receiver-companies/get-receiver-companies.query.handler";
import { GenerateDaillyReportJob } from "./invoice/jobs/dailly-report/generate-dailly-report.job";
import { SendDaillyReportToEmail } from "./invoice/email/send-dailly-report.email";
import { SearchCitiesQueryHandler } from "./city/queries/search-cities/search-cities.query-handler";
import { GetRoutesQueryHandler } from "./route/queries/get-routes/get-routes.query-handler";
import { CreateRouteCommandHandler } from "./route/commands/create-route/create-route.comand-handler";
import { AddCityCommandHandler } from "./route/commands/add-city/add-city.command-handler";
import { RemoveCityCommandHandler } from "./route/commands/remove-city/remove-city.command-handler";
import { DeleteRouteCommandHandler } from "./route/commands/delete-route/delete-route.command-handler";
  
declare module "inversify" {
    interface Container {
        addApplication(): this;
    }
  }
  
Container.prototype.addApplication = function() {
    this.bind(ImportInvoiceFromXmlCommandHandler).toSelf()
    this.bind(GetInvoiceErrorsQuery).toSelf();
    this.bind(GetInvoiceByDateQueryHandler).toSelf();
    this.bind(GetInvoiceByIssuerQueryHandler).toSelf();
    this.bind(RegisterCommandHandler).toSelf();
    this.bind(LoginQueryHandler).toSelf();
    this.bind(GetIssuerCompaniesQueryHandler).toSelf()
    this.bind(GetReceiverCompaniesQueryHandler).toSelf()
    this.bind(GenerateDaillyReportJob).toSelf()
    this.bind(SendDaillyReportToEmail).toSelf()
    this.bind(SearchCitiesQueryHandler).toSelf()
    this.bind(GetRoutesQueryHandler).toSelf()
    this.bind(CreateRouteCommandHandler).toSelf()
    this.bind(AddCityCommandHandler).toSelf()
    this.bind(RemoveCityCommandHandler).toSelf()
    this.bind(DeleteRouteCommandHandler).toSelf()

    return this;
}
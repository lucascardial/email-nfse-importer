import { Container } from "inversify";
import { ImportInvoiceFromXmlCommandHandler } from "./invoice/commands/import-invoice-from-xml/import-invoice-from-xml-command-handler";
import { GetInvoiceErrorsQuery } from "./invoice/queries/get-invoice-errors/get-invoice-errors.query";
import { GetInvoiceByDateQueryHandler } from "./invoice/queries/get-invoices/get-invoice-by-date.query.handler";
import { GetInvoiceByIssuerQueryHandler } from "./invoice/queries/get-invoices-by-issuer/get-invoices-by-issuer.query-handler";
import { RegisterCommandHandler } from "./authentication/command/register/register.command.handler";
import { LoginQueryHandler } from "./authentication/querie/login/login.query.handler";
import { GetIssuerCompaniesQueryHandler } from "./invoice/queries/get-issuer-companies/get-issuer-companies.query.handler";
import { GetReceiverCompaniesQueryHandler } from "./invoice/queries/get-receiver-companies/get-receiver-companies.query.handler";
import { DaillyInvoicesXmlExportService } from "./invoice/export/dailly-invoices-export/dailly-invoices-export.service";
  
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
    this.bind(DaillyInvoicesXmlExportService).toSelf()

    return this;
}
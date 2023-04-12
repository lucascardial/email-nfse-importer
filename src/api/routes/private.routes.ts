import { Router } from "express";
import { RegisterUserController } from "../controllers/authentication/register-user.controller";
import { DownloadReportController } from "../controllers/download-report.controller";
import { GetInvoiceErrorsController } from "../controllers/get-invoice-errors.controller";
import { GetInvoiceByDateController } from "../controllers/get-invoices-by-date.controller";
import { GetInvoiceByIssuerController } from "../controllers/get-invoices-by-issuer.controller";
import { GetIssuerCompaniesController } from "../controllers/get-issuer-companies.controller";
import { GetReceiverCompaniesController } from "../controllers/get-receiver-companies.controller";
import { container } from "../dependency-injection";
import { AuthMiddleware } from "../middlewares/auth-middleware";

const route = Router();

route.use(AuthMiddleware);
route.get('/list-errors', (req, res) => container.resolve(GetInvoiceErrorsController).handle(req, res));
route.get('/invoices', (req, res) => container.resolve(GetInvoiceByDateController).handle(req, res))
route.get('/invoices/issuer', (req, res) => container.resolve(GetInvoiceByIssuerController).handle(req, res))
route.get('/companies', (req, res) => container.resolve(GetIssuerCompaniesController).handle(req, res))
route.get('/company-receivers', (req, res) => container.resolve(GetReceiverCompaniesController).handle(req, res))
route.get('/download-report', (req, res) => container.resolve(DownloadReportController).downloadFile(req, res))

route.post('/register', (req, res) => container.resolve(RegisterUserController).handle(req, res))

export default route
import { Router } from "express";
import { container } from "./dependency-injection";
import { EmailWebhookController } from "./controllers/email-webhook.controller";
import { GetInvoiceErrorsController } from "./controllers/get-invoice-errors.controller";
import { GetInvoiceByDateController } from "./controllers/get-invoices-by-date.controller";
import { GetInvoiceByIssuerController } from "./controllers/get-invoices-by-issuer.controller";
import { RegisterUserController } from "./controllers/authentication/register-user.controller";
import { LoginController } from "./controllers/authentication/login.controller";
import { GetIssuerCompaniesController } from "./controllers/get-issuer-companies.controller";
import { GetReceiverCompaniesController } from "./controllers/get-receiver-companies.controller";

const routes = Router();

routes.post("/email-webhook", (req, res) => container.resolve(EmailWebhookController).handle(req, res));
routes.get('/list-errors', (req, res) => container.resolve(GetInvoiceErrorsController).handle(req, res));
routes.get('/invoices', (req, res) => container.resolve(GetInvoiceByDateController).handle(req, res))
routes.get('/invoices/issuer', (req, res) => container.resolve(GetInvoiceByIssuerController).handle(req, res))
routes.get('/companies', (req, res) => container.resolve(GetIssuerCompaniesController).handle(req, res))
routes.get('/company-receivers', (req, res) => container.resolve(GetReceiverCompaniesController).handle(req, res))

routes.post('/register', (req, res) => container.resolve(RegisterUserController).handle(req, res))
routes.post('/login', (req, res) => container.resolve(LoginController).handle(req, res));

routes.get('/', (req, res) => res.send('Hello World!'));

export default routes
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
import { SearchCitiesController } from "../controllers/search-cities.controller";
import { GetRoutesController } from "../controllers/get-routes.controller";
import { CreateRouteController } from "../controllers/create-route.controller";
import { RemoveCityFromRouteController } from "../controllers/remove-city-route.controller copy";
import { AddCityToRouteController } from "../controllers/add-city-route.controller";
import { DeleteRouteController } from "../controllers/delete-route.controller";
import { ControllerMiddleware } from "../controllers/base/controller-middleware";


const route = Router();

route.use(AuthMiddleware);

route.get('/list-errors', (req, res) => container.resolve(GetInvoiceErrorsController).handle(req, res));
route.get('/invoices', (req, res) => container.resolve(GetInvoiceByDateController).handle(req, res))
route.get('/invoices/issuer', (req, res) => container.resolve(GetInvoiceByIssuerController).handle(req, res))
route.get('/companies', (req, res) => container.resolve(GetIssuerCompaniesController).handle(req, res))
route.get('/company-receivers', (req, res) => container.resolve(GetReceiverCompaniesController).handle(req, res))
route.get('/download-report', (req, res) => container.resolve(DownloadReportController).downloadFile(req, res))
route.get('/cities', (req, res) => container.resolve(SearchCitiesController).handle(req, res));
route.get('/routes', (req, res) => container.resolve(GetRoutesController).handle(req, res));
route.post('/routes', (req, res, next) => ControllerMiddleware(req, res, next)(CreateRouteController));
route.delete('/routes/:routeUid', (req, res) =>  container.resolve(DeleteRouteController).handle(req, res));
route.post('/routes/:routeId/cities/:cityCode', (req, res, next) => ControllerMiddleware(req, res, next)(AddCityToRouteController));
route.delete('/routes/:routeId/cities/:cityCode', (req, res) => container.resolve(RemoveCityFromRouteController).handle(req, res));

route.post('/register', (req, res) => container.resolve(RegisterUserController).handle(req, res))

export default route
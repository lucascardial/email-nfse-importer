import { Router } from "express";
import { LoginController } from "../controllers/authentication/login.controller";
import { container } from "../dependency-injection";

const routes = Router();

routes.post('/login', (req, res) => container.resolve(LoginController).handle(req, res));
routes.get('/', (req, res) => res.send('Hello World!'));

export default routes
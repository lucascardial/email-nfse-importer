import { Request, Response, NextFunction } from "express";
import container from "../../../jobs/container";

export const ControllerMiddleware = (request: Request, response: Response, next: NextFunction) => {
    return (controller: any) => {
        try {
            const controllerInstance: any = container.resolve(controller);
            controllerInstance.handle(request, response).catch(next);            
        } catch (error) {            
            next(error)
        }
    }
}
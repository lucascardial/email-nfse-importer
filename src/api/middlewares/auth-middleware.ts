import { Request, Response, NextFunction } from "express";
import { container } from "../dependency-injection";
import { IJwt } from "../../application/authentication/commom/jwt.interface";
import moment from "moment";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const jwtService = container.get<IJwt>("IJwt");

    let jwt = req.headers.authorization;

    
    if(!jwt) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    jwt = jwt.replace("Bearer ", "");

    try {
        const claims = await jwtService.verify(jwt)
        
        if(!claims) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    next();
}
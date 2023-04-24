import express, { NextFunction } from "express";
import multer from "multer";
import { PrivateRoutes, PublicRoutes } from "./routes";
import cors from "cors";
import { Handling } from "./handling";

const server = express();
const upload = multer({ dest: "uploads/" });

const m = (request: any, response: any, next: NextFunction) => {
    try {
        return next()
    } catch (error) {
        console.log(" deu ruim de mais");

        return next()
    }
};

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(upload.any());
server.use(PublicRoutes);
server.use(PrivateRoutes);
server.use(Handling)

export default server;

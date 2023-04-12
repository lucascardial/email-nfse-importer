import express from "express";
import multer from "multer";
import { PrivateRoutes, PublicRoutes } from "./routes";
import cors from "cors";

const server = express();
const upload = multer({ dest: "uploads/" });

if(process.env.NODE_ENV === "production") {
    server.use(cors({
        origin: ["https://painel.deshowexpress.com.br"],
    }));
}

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(upload.any());
server.use(PublicRoutes);
server.use(PrivateRoutes);

export default server;

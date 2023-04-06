import express from 'express';
import multer from "multer"
import routes from './routes';
import cors from 'cors';

const server = express();
const upload = multer({ dest: 'uploads/' });

server.use(cors({
    origin: '*'
}));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(upload.any());
server.use(routes);


export default server;
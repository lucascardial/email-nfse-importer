import "reflect-metadata";
import server from "./server";
import * as dotenv from 'dotenv'; 
import { Handling } from "./handling";

dotenv.config()
server.use(Handling);

server.listen(3001, () => {
    console.log('Server started on port 3000!');
});

import "reflect-metadata";
import server from "./server";
import * as dotenv from 'dotenv'; 

dotenv.config()
server.listen(3001, () => {
    console.log('Server started on port 3000!');
});

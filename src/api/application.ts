import "reflect-metadata";
import server from "./server";

server.listen(3001, () => {
    console.log('Server started on port 3000!');
});

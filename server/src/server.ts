import Fastify from "fastify";
import cors from '@fastify/cors';
import { routes } from "./routes";

const app = Fastify();

app.register(cors);
app.register(routes);

app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => {
    console.log('HTTP Server running!')
});
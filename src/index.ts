import fastify from "fastify";
import waterRouter from "./routes/water.routes";
import cors from "@fastify/cors";
import { waterBodySchema } from "./schemas/water.schema";
import ajvErrors from "ajv-errors";

const server = fastify({
    logger: true, ajv: {
        customOptions: {
            allErrors: true,
            strict: false
        },
        plugins: [ajvErrors]
    }
});

const port: number = 7338;

server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
    credentials: false,
});

server.register(waterRouter, { prefix: "api/v1/water" });
server.addSchema(waterBodySchema);


const start = async () => {
    try {
        await server.listen({ port: port, host: '0.0.0.0' });
        server.log.info(`Server listening on port ${port}`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();


export default server
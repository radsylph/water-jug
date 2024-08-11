import type {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
} from "fastify";

import {
    solve,
    getSchemas
} from "../controllers/water.controllers";

const waterRouter = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: () => void) => {

    fastify.route({ //test schemas
        method: "GET",
        url: "/schemas",
        handler: (request, reply) => getSchemas(request, reply, fastify),
    });

    fastify.route({
        method: "POST",
        url: '/solve',
        handler: solve,
        schema: {
            body: { $ref: 'WaterBody#' }
        }
    })

    done();
}



export default waterRouter;
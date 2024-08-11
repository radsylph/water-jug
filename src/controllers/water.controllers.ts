import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import waterModule from "../modules/water.module";
import type { waterInterface } from "../interfaces/water.interface";
const waterModuleInstance = new waterModule();

const solve = async (request: FastifyRequest<{ Body: waterInterface }>, reply: FastifyReply) => {
    await waterModuleInstance.solveWaterJugProblem(request, reply)
}

const getSchemas = async ( //test schemas
    request: FastifyRequest,
    reply: FastifyReply,
    fastify: FastifyInstance,
) => {
    const schemas = fastify.getSchemas();
    await reply.code(200).send(schemas);
};

export {

    solve,
    getSchemas,
}
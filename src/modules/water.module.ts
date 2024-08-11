import fastify from "fastify";
import type { waterInterface, solutionInterface } from "../interfaces/water.interface";
import type { FastifyReply, FastifyRequest } from "fastify";

class waterModule {
    constructor() {
        console.log("waterModule loaded");
    }

    public async fill(bucket: 'X' | 'Y', x: number, y: number, x_capacity: number, y_capacity: number) {
        if (bucket === 'X') {
            console.log(`Filling X: ${x_capacity}`);
            return { x: x_capacity, y: y };
        }
        console.log(`Filling Y: ${y_capacity}`);
        return { x: x, y: y_capacity };
    }

    public async empty(bucket: 'X' | 'Y', x: number, y: number) {
        if (bucket === 'X') {
            console.log('Emptying X');
            return { x: 0, y: y };
        }
        console.log('Emptying Y');
        return { x: x, y: 0 };
    }

    public async transfer(bucket: 'X' | 'Y', x: number, y: number, x_capacity: number, y_capacity: number) {
        if (bucket === 'X') {
            const amount = Math.min(x, y_capacity - y);
            console.log(`Transferring ${amount} from X to Y`);
            return { x: x - amount, y: y + amount };
        }
        const amount = Math.min(y, x_capacity - x);
        console.log(`Transferring ${amount} from Y to X`);
        return { x: x + amount, y: y - amount };
    }

    public async gcd(a: number, b: number): Promise<number> {
        if (b === 0) {
            return a;
        }
        return this.gcd(b, a % b);
    }

    public async resolve(x_capacity: number, y_capacity: number, z_amount_wanted: number, startWith: 'X' | 'Y') {
        let steps = 0;
        let x = 0;
        let y = 0;
        const solution: solutionInterface = { steps: [], totalSteps: 0 };

        while (x !== z_amount_wanted && y !== z_amount_wanted) {
            console.log(`Current state: X=${x}, Y=${y}`);
            if (startWith === 'X' ? x === 0 : y === 0) {
                const fill = await this.fill(startWith, x, y, x_capacity, y_capacity);
                x = fill.x;
                y = fill.y;
                steps++;
                solution.steps.push({ step: steps, bucketX: x, bucketY: y, action: `Fill ${startWith} with ${startWith === 'X' ? x_capacity : y_capacity}L` });
            } else if (startWith === 'X' ? y === y_capacity : x === x_capacity) {
                const empty = await this.empty(startWith === 'X' ? 'Y' : 'X', x, y);
                x = empty.x;
                y = empty.y;
                steps++;
                solution.steps.push({ step: steps, bucketX: x, bucketY: y, action: `Empty ${startWith === 'X' ? 'Y' : 'X'}` });
            } else {
                const transfer = await this.transfer(startWith, x, y, x_capacity, y_capacity);
                x = transfer.x;
                y = transfer.y;
                steps++;
                solution.steps.push({ step: steps, bucketX: x, bucketY: y, action: `Transfer from ${startWith} to ${startWith === 'X' ? 'Y' : 'X'}` });
            }
        }
        solution.totalSteps = steps;
        return solution;
    }

    public async solveWaterJugProblem(request: FastifyRequest<{ Body: waterInterface }>, reply: FastifyReply) {
        const { x_capacity, y_capacity, z_amount_wanted } = request.body;
        try {
            console.log(`Received request: x_capacity=${x_capacity}, y_capacity=${y_capacity}, z_amount_wanted=${z_amount_wanted}`);
            if (x_capacity <= 0 || y_capacity <= 0 || z_amount_wanted <= 0) {
                return reply.code(400).send({ message: "Invalid input: capacities and amount wanted must be positive numbers." });
            }
            if (z_amount_wanted > Math.max(x_capacity, y_capacity)) {
                return reply.code(422).send({ statusCode: 422, error: "Unprocessable Entity", message: "Amount wanted is greater than the capacity of both jugs. There is not a possible solution" });
            }

            const gcdResult = await this.gcd(x_capacity, y_capacity);
            if (z_amount_wanted % gcdResult !== 0) {
                return reply.code(422).send({ statusCode: 422, error: "Unprocessable Entity", message: "Amount wanted is not a multiple of the greatest common divisor of the capacities of the jugs.  There is not a possible solution" });
            }

            const solveXfirst = await this.resolve(x_capacity, y_capacity, z_amount_wanted, 'X');
            const solveYfirst = await this.resolve(x_capacity, y_capacity, z_amount_wanted, 'Y');
            const solution = solveXfirst.steps.length < solveYfirst.steps.length ? solveXfirst : solveYfirst;

            return reply.code(200).send({ message: "Water jug problem solved", solution: solution });
        } catch (error) {
            console.log(error);
            return reply.code(500).send({ message: "Error solving water jug problem", error });
        }
    }
}

export default waterModule;
import waterModule from './water.module';
import request from 'supertest';
import server from '../index';

import { waterInterface } from '../interfaces/water.interface';

describe('waterModule', () => {
    let module: waterModule;

    beforeEach(() => {
        module = new waterModule();
    });

    test('should fill X correctly', async () => {
        const result = await module.fill('X', 0, 0, 5, 3);
        expect(result).toEqual({ x: 5, y: 0 });
    });

    test('should fill Y correctly', async () => {
        const result = await module.fill('Y', 0, 0, 5, 3);
        expect(result).toEqual({ x: 0, y: 3 });
    });

    test('should empty X correctly', async () => {
        const result = await module.empty('X', 5, 3);
        expect(result).toEqual({ x: 0, y: 3 });
    });

    test('should empty Y correctly', async () => {
        const result = await module.empty('Y', 5, 3);
        expect(result).toEqual({ x: 5, y: 0 });
    });

    test('should transfer from X to Y correctly', async () => {
        const result = await module.transfer('X', 5, 2, 5, 3);
        expect(result).toEqual({ x: 4, y: 3 });
    });

    test('should transfer from Y to X correctly', async () => {
        const result = await module.transfer('Y', 2, 3, 5, 3);
        expect(result).toEqual({ x: 5, y: 0 });
    });

    test('should solve water jug problem correctly', async () => {
        const request = {
            body: {
                x_capacity: 5,
                y_capacity: 3,
                z_amount_wanted: 4
            }
        } as any;
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as any;

        await module.solveWaterJugProblem(request, reply);

        expect(reply.code).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
            message: "Water jug problem solved",
            solution: expect.any(Object)
        }));
    });
});

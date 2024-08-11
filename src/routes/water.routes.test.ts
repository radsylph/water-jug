import axios from 'axios';
import server from '../index'; // Asegúrate de que la ruta sea correcta

let address: string;

beforeAll(async () => {
    await server.listen(1);
    address = `http://localhost:${server.server.address()}`;
});

afterAll(async () => {
    await server.close();
});
jest.mock('axios');
describe('Water Module Endpoints', () => {
    test('POST /api/v1/water/solve - should return 400 for invalid input', async () => {
        try {
            await axios.post(`${address}/api/v1/water/solve`, {
                x_capacity: -5,
                y_capacity: 3,
                z_amount_wanted: 4
            });
        } catch (error: any) {
            if (error.response) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message', 'Invalid input: capacities and amount wanted must be positive numbers.');
            } else {
                throw error;
            }
        }
    });

    test('POST /api/v1/water/solve - should return 400 for amount wanted greater than capacities', async () => {
        try {
            await axios.post(`${address}/api/v1/water/solve`, {
                x_capacity: 5,
                y_capacity: 3,
                z_amount_wanted: 10
            });
        } catch (error: any) {
            if (error.response) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message', 'Amount wanted is greater than the capacity of both jugs.');
            } else {
                throw error;
            }
        }
    });

    test('POST /api/v1/water/solve - should return 400 for amount wanted not a multiple of gcd', async () => {
        try {
            await axios.post(`${address}/api/v1/water/solve`, {
                x_capacity: 5,
                y_capacity: 3,
                z_amount_wanted: 2
            });
        } catch (error: any) {
            if (error.response) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('message', 'Amount wanted is not a multiple of the greatest common divisor of the capacities of the jugs.');
            } else {
                throw error;
            }
        }
    });
});
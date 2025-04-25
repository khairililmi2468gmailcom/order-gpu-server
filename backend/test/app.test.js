import request from 'supertest';
import http from 'http';
import app from '../app.js';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import mockFs from 'mock-fs';

let server;
let userToken, adminToken, orderId, paymentId;

// test/app.test.js
beforeAll(async () => {
    server = http.createServer(app);
    await new Promise(resolve => server.listen(resolve));

    // Clear existing test data
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM gpu_packages');

    // Only seed admin user
    const hashedAdminPass = await bcrypt.hash('admin123', 10);
    await pool.query(
        `INSERT INTO users (name, email, password, phone, role) 
       VALUES ('Admin', 'admin@test.com', ?, '08123456789', 'admin')`,
        [hashedAdminPass]
    );

    // Insert GPU package with all required fields
    await pool.query(
        `INSERT INTO gpu_packages (id, name, price_per_hour, vcpu)
       VALUES (1, 'Test GPU', 1000, 4)` // Added vcpu value
    );
});
afterAll(async () => {
    // Clean up in reverse order of foreign key dependencies
    await pool.query('DELETE FROM payments');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM gpu_packages');
    await pool.end();
    server.close();
});
describe('Test the root path', () => {
    it('should respond with 200 status code', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
    });
});

describe('User & Admin Flow', () => {
    test('Register User', async () => {
        const res = await request(server).post('/api/auth/register').send({
            name: 'Test User',
            email: 'newuser@test.com', // Use unique email
            password: 'password123',
            phone: '08123456789'
        });
        expect(res.statusCode).toBe(201);
    });

    test('Login User', async () => {
        const res = await request(server).post('/api/auth/login').send({
            email: 'newuser@test.com', // Match registration email
            password: 'password123'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        userToken = res.body.token;
    });

    test('Create Order', async () => {
        const res = await request(server)
            .post('/api/user/orders')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                gpu_package_id: 1,
                duration_days: 15
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.orderId).toBeDefined();
        orderId = res.body.orderId;
    });


    test('Login Admin', async () => {
        const res = await request(server).post('/api/auth/login').send({
            email: 'admin@test.com',
            password: 'admin123'
        });
        expect(res.statusCode).toBe(200);
        adminToken = res.body.token;
    });

    test('Admin Get Orders', async () => {
        const res = await request(server)
            .get('/api/admin/orders')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        const foundOrder = res.body.find(o => o.id === orderId);
        expect(foundOrder).toBeDefined();
        paymentId = foundOrder.payment_id;
    });

    test('Admin Verify Payment (Approve)', async () => {
        const res = await request(server)
            .put('/api/admin/payments/verify')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ payment_id: paymentId, status: 'approved' });
        expect(res.statusCode).toBe(200);
    });

    test('User See Order with Token', async () => {
        const res = await request(server)
            .get('/api/user/orders')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        const order = res.body.find(o => o.id === orderId);
        expect(order.gpu_token).toBeDefined();
    });
});

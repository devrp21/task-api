import request from 'supertest';
import app from '../app.js';
import {sequelize} from '../models/index.js'; 
;

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true }); 
  } catch (err) {
    console.error('Failed to sync DB:', err);
    throw err;
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  test('POST /api/register → should register user', async () => {
    const res = await request(app).post('/api/register').send({
      username: 'tasuser',
    password: 'taskpass'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  test('POST /api/login → should login user and return token', async () => {
    const res = await request(app).post('/api/login').send({
      username: 'tasuser',
      password: 'taskpass',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

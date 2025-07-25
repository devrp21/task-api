import request from 'supertest';
import app from '../app.js';
import { sequelize, User,Task } from '../models/index.js';


let token = '';
let taskId = '';

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await request(app).post('/api/register').send({
    username: 'tasuser',
    password: 'taskpass'
  });

  const res = await request(app).post('/api/login').send({
    username: 'tasuser',
    password: 'taskpass'
  });

  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Task API', () => {
  test('Create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a task for testing'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.task.title).toBe('Test Task'); // <-- FIXED
    taskId = res.body.task.id; // <-- FIXED
  });

  test('Get all tasks for user', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(task => task.id === taskId)).toBe(true);
  });

  test('Get a single task by ID', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(taskId);
    expect(res.body.title).toBe('Test Task');
  });

  test('Fail to get a task with invalid ID', async () => {
    const res = await request(app)
      .get('/api/tasks/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test('Fail to create a task without title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  test('Update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Task' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task updated successfully');
  });

  test('Fail to update a non-existent task', async () => {
    const res = await request(app)
      .put('/api/tasks/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Does Not Exist' });

    expect(res.statusCode).toBe(404);
  });

  test('Fail to access tasks without token', async () => {
    const res = await request(app)
      .get('/api/tasks');

    expect(res.statusCode).toBe(401);
  });

  test('Delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });
});

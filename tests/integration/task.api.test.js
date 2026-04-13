import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

jest.setTimeout(20000);

let mongoServer;

describe('Task API', () => {
  let projectId;
  let userId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    // Create user
    const userRes = await request(app)
      .post('/api/users/create')
      .send({
        name: 'Task User',
        email: `task-user-${Date.now()}@test.com`,
      });

    userId = userRes.body.data._id;

    // Create project
    const projectRes = await request(app).post('/api/projects').send({
      name: 'Test Project',
      owner: userId,
    });

    projectId = projectRes.body.data._id;
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Create Task API', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Test Task',
      project: projectId,
    });

    expect(res.statusCode).toBe(201);
  });

  test('Assign Task API', async () => {
    const createdTask = await request(app).post('/api/tasks').send({
      title: 'Task to Assign',
      project: projectId,
    });

    const res = await request(app)
      .patch(`/api/tasks/${createdTask.body.data._id}/assign`)
      .send({ userId });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.assignedTo).toBe(userId);
  });

  test('Update Task Status API', async () => {
    const createdTask = await request(app).post('/api/tasks').send({
      title: 'Task to Update Status',
      project: projectId,
    });

    const res = await request(app)
      .patch(`/api/tasks/${createdTask.body.data._id}/status`)
      .send({ status: 'DONE' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('DONE');
  });

  test('Get Tasks with filters', async () => {
    const firstTask = await request(app).post('/api/tasks').send({
      title: 'Done task',
      project: projectId,
    });

    await request(app)
      .patch(`/api/tasks/${firstTask.body.data._id}/status`)
      .send({ status: 'DONE' });

    await request(app).post('/api/tasks').send({
      title: 'Todo task',
      project: projectId,
    });

    const res = await request(app).get(
      `/api/tasks?status=DONE&project=${projectId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.data.tasks.length).toBeGreaterThan(0);
  });

  test('Aggregation API: Get user productivity stats', async () => {
    const taskRes = await request(app).post('/api/tasks').send({
      title: 'Productivity task',
      project: projectId,
    });

    await request(app)
      .patch(`/api/tasks/${taskRes.body.data._id}/assign`)
      .send({ userId });

    await request(app)
      .patch(`/api/tasks/${taskRes.body.data._id}/status`)
      .send({ status: 'DONE' });

    const res = await request(app).get('/api/tasks/analytics/top-users');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('should fail if title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({
      project: projectId,
    });

    expect(res.statusCode).toBe(400);
  });
});
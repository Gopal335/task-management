import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { jest } from '@jest/globals';

jest.setTimeout(15000);

describe('Project API', () => {
  const projectId = new mongoose.Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/test-db');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Create Project with custom ID', async () => {
    const res = await request(app).post('/api/projects').send({
      _id: projectId,
      name: 'Test Project',
      owner: new mongoose.Types.ObjectId(),
    });

    expect(res.statusCode).toBe(201);
  });

  test('Aggregation API', async () => {
    const res = await request(app).get('/api/projects/analytics/task-count');

    expect(res.statusCode).toBe(200);
  });
});

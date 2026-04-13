import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

jest.setTimeout(20000);

let mongoServer;

describe('Project API', () => {
  let projectId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    projectId = new mongoose.Types.ObjectId();
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
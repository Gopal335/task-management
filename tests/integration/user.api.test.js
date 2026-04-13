import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

jest.setTimeout(20000);

let mongoServer;

describe('User API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
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

  test('Create User', async () => {
    const res = await request(app)
      .post('/api/users/create')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@test.com`, // unique email
      });

    expect(res.statusCode).toBe(201);
  });

  test('should fail if email missing', async () => {
    const res = await request(app).post('/api/users/create').send({
      name: 'Test User',
    });

    expect(res.statusCode).toBe(400);
  });
});
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import { jest } from "@jest/globals";

jest.setTimeout(15000);

describe("User API", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-db");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Create User", async () => {
    const res = await request(app).post("/api/users/create").send({
      name: "Test User",
      email: `test${Date.now()}@test.com`, // ✅ UNIQUE EMAIL
    });

    expect(res.statusCode).toBe(201);
  });
});

test("should fail if email missing", async () => {
  const res = await request(app).post("/api/users/create").send({
    name: "Test User",
  });

  expect(res.statusCode).toBe(400);
});
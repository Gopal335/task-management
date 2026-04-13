import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import { jest } from "@jest/globals";

jest.setTimeout(15000);

describe("Task API", () => {
  let projectId;
  let taskId;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-db");

    const projectRes = await request(app).post("/api/projects").send({
      name: "Test Project",
      owner: new mongoose.Types.ObjectId(), // ✅ FIXED
    });

    projectId = projectRes.body.data._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Create Task API", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Test Task",
      project: projectId,
    });

    taskId = res.body.data._id;

    expect(res.statusCode).toBe(201);
  });

  test("Update Task Status API", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .send({ status: "DONE" });

    expect(res.statusCode).toBe(200);
  });
});

test("should fail if title is missing", async () => {
  const res = await request(app).post("/api/tasks").send({
    project: projectId,
  });

  expect(res.statusCode).toBe(400);
});
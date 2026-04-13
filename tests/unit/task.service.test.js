import { jest } from "@jest/globals";

// ✅ 1. Mock FIRST
const mockTask = {
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

jest.unstable_mockModule("../../models/task.model.js", () => ({
  default: mockTask,
}));

// ✅ 2. THEN import service (IMPORTANT ORDER)
const { createTask, updateTaskStatus } = await import(
  "../../src/task/task.service.js"
);

describe("Task Service", () => {
  test("should create task", async () => {
    mockTask.create.mockResolvedValue({
      _id: "1",
      title: "Test Task",
    });

    const result = await createTask({ title: "Test Task" });

    expect(result.title).toBe("Test Task");
  });

  test("should update status", async () => {
    mockTask.findByIdAndUpdate.mockResolvedValue({
      _id: "1",
      status: "DONE",
    });

    const result = await updateTaskStatus("1", "DONE");

    expect(result.status).toBe("DONE");
  });
});

test("should throw error for invalid status", async () => {
  await expect(updateTaskStatus("1", "INVALID")).rejects.toThrow();
});

test("should throw error if task not found", async () => {
  mockTask.findByIdAndUpdate.mockResolvedValue(null);

  await expect(updateTaskStatus("1", "DONE")).rejects.toThrow();
});
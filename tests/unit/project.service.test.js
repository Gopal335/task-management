import { jest } from "@jest/globals";

const mockTask = {
  aggregate: jest.fn(),
};

jest.unstable_mockModule("../../models/task.model.js", () => ({
  default: mockTask,
}));

const { getProjectTaskStats } = await import(
  "../../src/project/project.service.js"
);

describe("Project Aggregation", () => {
  test("should return aggregated stats", async () => {
    mockTask.aggregate.mockResolvedValue([
      { projectName: "Test Project", statuses: [] },
    ]);

    const result = await getProjectTaskStats();

    expect(result.length).toBeGreaterThan(0);
  });
});

test("should return empty aggregation result", async () => {
  mockTask.aggregate.mockResolvedValue([]);

  const result = await getProjectTaskStats();

  expect(result).toEqual([]);
});

test("should throw error if aggregation fails", async () => {
  mockTask.aggregate.mockRejectedValue(new Error("DB Error"));

  await expect(getProjectTaskStats()).rejects.toThrow();
});
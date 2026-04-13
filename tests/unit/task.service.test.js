import { jest } from '@jest/globals';

// ✅ 1. Mock FIRST
const mockTask = {
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
};

jest.unstable_mockModule('../../models/task.model.js', () => ({
  default: mockTask,
}));

// ✅ 2. THEN import service (IMPORTANT ORDER)
const { createTask, updateTaskStatus, getTasks, assignTask } =
  await import('../../src/task/task.service.js');

describe('Task Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create task', async () => {
    mockTask.create.mockResolvedValue({
      _id: '1',
      title: 'Test Task',
    });

    const result = await createTask({ title: 'Test Task' });

    expect(result.title).toBe('Test Task');
  });

  test('should update status', async () => {
    mockTask.findByIdAndUpdate.mockResolvedValue({
      _id: '1',
      status: 'DONE',
    });

    const result = await updateTaskStatus('1', 'DONE');

    expect(result.status).toBe('DONE');
  });

  test('should return filtered tasks', async () => {
    mockTask.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([{ _id: 't1' }]),
      }),
    });
    mockTask.countDocuments.mockResolvedValue(1);

    const result = await getTasks({
      status: 'DONE',
      user: 'u1',
      project: 'p1',
    });

    expect(result.total).toBe(1);
    expect(result.tasks).toHaveLength(1);
  });

  test('should assign task to user', async () => {
    mockTask.findByIdAndUpdate.mockResolvedValue({
      _id: 't1',
      assignedTo: 'u1',
    });
    const result = await assignTask('t1', 'u1');
    expect(result.assignedTo).toBe('u1');
  });

  test('should throw error for invalid status', async () => {
    await expect(updateTaskStatus('1', 'INVALID')).rejects.toThrow();
  });

  test('should throw error if task not found', async () => {
    mockTask.findByIdAndUpdate.mockResolvedValue(null);
    await expect(updateTaskStatus('1', 'DONE')).rejects.toThrow();
  });
});

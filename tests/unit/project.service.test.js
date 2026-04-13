import { jest } from '@jest/globals';

const mockProject = {
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockTask = {
  aggregate: jest.fn(),
  find: jest.fn(),
};

jest.unstable_mockModule('../../models/project.model.js', () => ({
  default: mockProject,
}));

jest.unstable_mockModule('../../models/task.model.js', () => ({
  default: mockTask,
}));

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTasks,
  getProjectTaskStats,
  getProjectCompletionRate,
} = await import('../../src/project/project.service.js');

describe('Project Aggregation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create project', async () => {
    mockProject.create.mockResolvedValue({ _id: 'p1', name: 'Alpha' });
    const result = await createProject({ name: 'Alpha' });
    expect(result.name).toBe('Alpha');
  });

  test('should return paginated projects', async () => {
    mockProject.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ _id: 'p1' }]),
        }),
      }),
    });
    mockProject.countDocuments.mockResolvedValue(1);

    const result = await getProjects({ page: 1, limit: 10 });
    expect(result.total).toBe(1);
    expect(result.projects).toHaveLength(1);
  });

  test('should throw when project not found', async () => {
    mockProject.findById.mockResolvedValue(null);
    await expect(getProjectById('missing')).rejects.toThrow();
  });

  test('should update project', async () => {
    mockProject.findByIdAndUpdate.mockResolvedValue({ _id: 'p1', name: 'N' });
    const result = await updateProject('p1', { name: 'N' });
    expect(result.name).toBe('N');
  });

  test('should throw when deleting unknown project', async () => {
    mockProject.findByIdAndDelete.mockResolvedValue(null);
    await expect(deleteProject('missing')).rejects.toThrow();
  });

  test('should return project tasks with filters', async () => {
    mockTask.find.mockResolvedValue([{ _id: 't1' }]);
    const result = await getProjectTasks('p1', { status: 'DONE' });
    expect(result).toHaveLength(1);
  });

  test('should return aggregated task count stats', async () => {
    mockTask.aggregate.mockResolvedValue([
      { projectName: 'Test Project', statuses: [] },
    ]);

    const result = await getProjectTaskStats();

    expect(result.length).toBeGreaterThan(0);
  });

  test('should return completion rate aggregation', async () => {
    mockTask.aggregate.mockResolvedValue([
      { projectId: 'p1', completionRate: 80 },
    ]);
    const result = await getProjectCompletionRate();
    expect(result[0].completionRate).toBe(80);
  });
});

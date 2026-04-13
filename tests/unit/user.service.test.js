import { jest } from '@jest/globals';

const mockUser = {
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

jest.unstable_mockModule('../../models/user.model.js', () => ({
  default: mockUser,
}));

const { createUser, getUsers, getUserById, updateUser, deleteUser } =
  await import('../../src/user/user.service.js');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create user', async () => {
    mockUser.findOne.mockResolvedValue(null);
    mockUser.create.mockResolvedValue({
      _id: 'u1',
      name: 'User One',
      email: 'u1@test.com',
    });

    const result = await createUser({
      name: 'User One',
      email: 'u1@test.com',
    });

    expect(result.email).toBe('u1@test.com');
  });

  test('should throw error if email exists', async () => {
    mockUser.findOne.mockResolvedValue({ email: 'test@test.com' });

    await expect(createUser({ email: 'test@test.com' })).rejects.toThrow();
  });

  test('should return paginated users', async () => {
    mockUser.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ _id: 'u1' }]),
        }),
      }),
    });
    mockUser.countDocuments.mockResolvedValue(1);

    const result = await getUsers({ page: 1, limit: 10 });

    expect(result.total).toBe(1);
    expect(result.users).toHaveLength(1);
  });

  test('should return user by id', async () => {
    mockUser.findById.mockResolvedValue({ _id: 'u1' });

    const result = await getUserById('u1');

    expect(result._id).toBe('u1');
  });

  test('should throw if user not found by id', async () => {
    mockUser.findById.mockResolvedValue(null);
    await expect(getUserById('missing')).rejects.toThrow();
  });

  test('should update user', async () => {
    mockUser.findOne.mockResolvedValue(null);
    mockUser.findByIdAndUpdate.mockResolvedValue({
      _id: 'u1',
      name: 'Updated',
    });

    const result = await updateUser('u1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  test('should throw when deleting missing user', async () => {
    mockUser.findByIdAndDelete.mockResolvedValue(null);
    await expect(deleteUser('missing')).rejects.toThrow();
  });
});

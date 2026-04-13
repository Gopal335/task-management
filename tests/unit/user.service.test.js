import { jest } from "@jest/globals";

const mockUser = {
  create: jest.fn(),
  findOne: jest.fn(),
};

jest.unstable_mockModule("../../models/user.model.js", () => ({
  default: mockUser,
}));

const { createUser } = await import(
  "../../src/user/user.service.js"
);

describe("User Service", () => {
  test("should throw error if email exists", async () => {
    mockUser.findOne.mockResolvedValue({ email: "test@test.com" });

    await expect(
      createUser({ email: "test@test.com" })
    ).rejects.toThrow();
  });
});

test("should throw error if user already exists", async () => {
  mockUser.findOne.mockResolvedValue({ email: "test@test.com" });

  await expect(
    createUser({ email: "test@test.com" })
  ).rejects.toThrow();
});

test("should throw error if email missing", async () => {
  await expect(createUser({})).rejects.toThrow();
});
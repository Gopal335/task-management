import User from '../../models/user.model.js';
import AppError from '../../utils/error.js';

/**
 * Create User
 */
export const createUser = async (data) => {
  // Check duplicate email
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new AppError('Email already exists', 400);
  }

  return await User.create(data);
};

/**
 * Get All Users (Pagination + Sorting)
 */
export const getUsers = async (query) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = query;

  const skip = (page - 1) * limit;

  const users = await User.find().sort(sort).skip(skip).limit(Number(limit));

  const total = await User.countDocuments();

  return {
    total,
    users,
    page: Number(page),
    limit: Number(limit),
  };
};

/**
 * Get Single User
 */
export const getUserById = async (id) => {
  const user = await User.findById(id);

  if (!user) throw new AppError('User not found', 404);

  return user;
};

/**
 * Update User
 */
export const updateUser = async (id, data) => {
  // Prevent email duplication on update
  if (data.email) {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser && existingUser._id.toString() !== id) {
      throw new AppError('Email already in use', 400);
    }
  }

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError('User not found', 404);

  return user;
};

/**
 * Delete User
 */
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) throw new AppError('User not found', 404);
};

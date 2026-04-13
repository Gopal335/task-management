import asyncHandler from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/response.js';
import * as userService from './user.service.js';
import { validateRequired } from '../../utils/validator.js';

/**
 * @route POST /api/users
 */
export const createUser = asyncHandler(async (req, res) => {
  validateRequired(['name', 'email'], req.body);

  const user = await userService.createUser(req.body);

  return sendResponse(res, 201, 'User created successfully', user);
});

/**
 * @route GET /api/users
 */
export const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);

  return sendResponse(res, 200, 'Users fetched', result);
});

/**
 * @route GET /api/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return sendResponse(res, 200, 'User fetched', user);
});

/**
 * @route PUT /api/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const updated = await userService.updateUser(req.params.id, req.body);

  return sendResponse(res, 200, 'User updated', updated);
});

/**
 * @route DELETE /api/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);

  return sendResponse(res, 200, 'User deleted');
});

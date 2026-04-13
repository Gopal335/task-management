import asyncHandler from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/response.js';
import * as taskService from './task.service.js';
import { validateRequired } from '../../utils/validator.js';

export const createTask = asyncHandler(async (req, res) => {
  validateRequired(['title', 'project'], req.body);

  const task = await taskService.createTask(req.body);

  return sendResponse(res, 201, 'Task created', task);
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.query);

  return sendResponse(res, 200, 'Tasks fetched', tasks);
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);

  return sendResponse(res, 200, 'Task fetched', task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const updated = await taskService.updateTask(req.params.id, req.body);

  return sendResponse(res, 200, 'Task updated', updated);
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);

  return sendResponse(res, 200, 'Task deleted');
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  validateRequired(['status'], req.body);

  const task = await taskService.updateTaskStatus(
    req.params.id,
    req.body.status
  );

  return sendResponse(res, 200, 'Status updated', task);
});

export const assignTask = asyncHandler(async (req, res) => {
  validateRequired(['userId'], req.body);

  const task = await taskService.assignTask(req.params.id, req.body.userId);

  return sendResponse(res, 200, 'Task assigned', task);
});

export const getTopUsers = asyncHandler(async (req, res) => {
  const data = await taskService.getTopUsers();

  return sendResponse(res, 200, 'Top active users fetched', data);
});

import asyncHandler from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/response.js';
import * as projectService from './project.service.js';
import { validateRequired } from '../../utils/validator.js';

export const createProject = asyncHandler(async (req, res) => {
  validateRequired(['name'], req.body);

  const project = await projectService.createProject(req.body);

  return sendResponse(res, 201, 'Project created successfully', project);
});

export const getProjects = asyncHandler(async (req, res) => {
  const result = await projectService.getProjects(req.query);

  return sendResponse(res, 200, 'Projects fetched', result);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);

  return sendResponse(res, 200, 'Project fetched', project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const updated = await projectService.updateProject(req.params.id, req.body);

  return sendResponse(res, 200, 'Project updated', updated);
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);

  return sendResponse(res, 200, 'Project deleted');
});

export const getProjectTasks = asyncHandler(async (req, res) => {
  const tasks = await projectService.getProjectTasks(req.params.id, req.query);

  return sendResponse(res, 200, 'Project tasks fetched', tasks);
});

export const getProjectTaskStats = asyncHandler(async (req, res) => {
  const data = await projectService.getProjectTaskStats();

  return sendResponse(res, 200, 'Project task stats fetched', data);
});

export const getProjectCompletionRate = asyncHandler(async (req, res) => {
  const data = await projectService.getProjectCompletionRate();

  return sendResponse(res, 200, 'Project completion rate fetched', data);
});

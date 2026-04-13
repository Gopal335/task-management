import express from 'express';
import * as projectController from '../src/project/project.controller.js';

const router = express.Router();

router.post('/', projectController.createProject);

router.get('/', projectController.getProjects);

router.get('/:id', projectController.getProjectById);

router.put('/:id', projectController.updateProject);

router.delete('/:id', projectController.deleteProject);

router.get('/:id/tasks', projectController.getProjectTasks);

router.get('/analytics/task-count', projectController.getProjectTaskStats);
router.get(
  '/analytics/completion-rate',
  projectController.getProjectCompletionRate
);

export default router;

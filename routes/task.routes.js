import express from 'express';
import * as taskController from '../src/task/task.controller.js';

const router = express.Router();

router.post('/', taskController.createTask);

router.get('/', taskController.getTasks);
router.get('/analytics/top-users', taskController.getTopUsers);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

router.patch('/:id/status', taskController.updateTaskStatus);

router.patch('/:id/assign', taskController.assignTask);

export default router;

import express from 'express';
import userRoutes from './user.routes.js';
import projectRoutes from './projects.routes.js';
import taskRoutes from './task.routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export default router;

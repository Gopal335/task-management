import express from 'express';
import * as userController from '../src/user/user.controller.js';

const router = express.Router();

router.post('/create', userController.createUser);
router.get('/', userController.getUsers);

export default router;

import express from 'express';
import taskController from '../controller/task.controller.js';
import verifyToken from '../middleware/jwt.token.middleware.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.put('/:id', taskController.update);
router.patch('/:id', taskController.update);
router.patch('/:id/toggle', taskController.toggleCompletion); 

router.delete('/:id', taskController.remove);

export default router;

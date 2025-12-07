import express from 'express';
import * as questionController from '../controllers/questionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/:state', questionController.getQuestionsByState);
router.get('/:state/categories', questionController.getCategories);
router.get('/:state/category/:category', questionController.getByCategory);
router.post('/', authenticate, questionController.createQuestion);

export default router;

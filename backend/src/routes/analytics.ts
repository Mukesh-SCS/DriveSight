import express from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/performance', authenticate, analyticsController.submitPerformance);
router.get('/stats', authenticate, analyticsController.getUserStats);
router.get('/progress', authenticate, analyticsController.getProgress);

export default router;

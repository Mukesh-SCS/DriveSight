import express from 'express';
import * as signController from '../controllers/signController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/identify', upload.single('file'), signController.identifySign);
router.get('/', signController.getAllSigns);
router.get('/:id', signController.getSignById);
router.get('/category/:category', signController.getByCategory);
router.post('/', authenticate, signController.createSign);

export default router;

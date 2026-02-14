import { Router } from 'express';
import { analyzeApplication } from '../controllers/aiController';

const router = Router();

router.post('/analyze', analyzeApplication);

export default router;

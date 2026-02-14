import { Router } from 'express';
import { getResumes, createResume, updateResume, deleteResume, uploadResume, upload } from '../controllers/resumeController';

const router = Router();

router.post('/upload', upload.single('file'), uploadResume);
router.get('/', getResumes);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;

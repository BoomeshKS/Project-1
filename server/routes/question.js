import express from 'express';
import { askQuestion } from '../components/questionAuth.js';

const router = express.Router();

router.post('/question',askQuestion);

export default router;
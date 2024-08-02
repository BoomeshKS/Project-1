import express from 'express';
import { updateUserPoints } from '../components/auth.js';


const router = express.Router();

router.post('/data', updateUserPoints); 

export default router;
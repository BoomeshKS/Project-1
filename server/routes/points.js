import express from 'express';
const router = express.Router();
import { savePoints, checkUsername,decreasePoints,increasePoints,saveUsername,getPoints, pointsIncrease } from '../controllers/pointsController.js';


router.post('/point', savePoints);
router.get('/check-username', checkUsername);
router.put('/increase', increasePoints);
router.put('/point-increase', pointsIncrease);
router.post('/username', saveUsername);
router.get('/get-points', getPoints);  
router.put('/decrease', decreasePoints); 

export default router;
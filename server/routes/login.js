import express from 'express';
import { storeLoginInfo, getAllLoginHistory,updateLoginHistory  } from '../controllers/loginController.js';

const router = express.Router();

router.post('/storeLoginInfo', storeLoginInfo);
router.get('/getLoginHistory', getAllLoginHistory);
router.put('/putLoginHistory/:userid', updateLoginHistory);


export default router;

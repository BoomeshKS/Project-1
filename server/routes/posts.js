import express from 'express';
import { uploadPost,upload,getPosts,updatePost,updateAnswerVote,deleteAnswer } from '../controllers/postController.js';



const router = express.Router();

router.post('/posts', upload.single('video'), uploadPost);

router.get('/getposts', getPosts);
router.put('/putposts/:id', updatePost);
router.put('/updatevote/:id', updateAnswerVote)
router.delete('/deletepost/:questionId/:answerId', deleteAnswer);



export default router;

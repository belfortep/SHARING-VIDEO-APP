import express from 'express'
const router = express.Router();
import CommentController from '../controllers/CommentController.js'
import { verifyToken } from '../verifyToken.js';

router.post('/', verifyToken, CommentController.addComment)

router.delete('/:id', verifyToken, CommentController.deleteComment)

router.get('/:videoId', CommentController.getComments)



export default router;
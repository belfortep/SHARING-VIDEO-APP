import express from 'express'
const router = express.Router();
import VideoController from '../controllers/VideoController.js'
import { verifyToken } from '../verifyToken.js';


router.post('/', verifyToken, VideoController.addVideo);

router.put('/:id', verifyToken, VideoController.updateVideoById);

router.put('/view/:id', verifyToken, VideoController.addView);

router.delete('/:id', verifyToken, VideoController.deleteVideoById);

router.get('/find/:id', VideoController.getVideoById);

router.get('/trend', VideoController.trend);

router.get('/random', VideoController.random);

router.get('/sub', verifyToken, VideoController.sub);

router.get('/tags', VideoController.getByTag);

router.get('/search', VideoController.search);

export default router;
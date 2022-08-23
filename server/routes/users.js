import express from 'express'
const router = express.Router();
import UserController from '../controllers/UserController.js'
import { verifyToken } from '../verifyToken.js';

router.put('/:id', verifyToken, UserController.updateById)

router.delete('/:id', verifyToken, UserController.deleteById)

router.get('/find/:id', UserController.getUserById)


//id del canal al que me quiero subscribir
router.put('/sub/:id', verifyToken, UserController.subscribe)

router.put('/unsub/:id', verifyToken, UserController.unsubscribe)



router.put('/like/:videoId', verifyToken, UserController.like)

router.put('/dislike/:videoId', verifyToken, UserController.dislike)


export default router;
import express from 'express'
const router = express.Router();
import AuthController from '../controllers/AuthController.js'

router.post('/signup', AuthController.signup);

router.post('/signin', AuthController.signin);

router.post('/google', AuthController.googleAuth);

export default router;
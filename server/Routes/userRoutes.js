import express from 'express'
import {checkEmail, completeProfile, verifyOTP, logoutUser, refreshAccessToken} from '../Controller/userController.js'
import { upload } from '../Middleware/multer.js'
import verifyJWT from '../Middleware/Auth.js'

const router = express.Router()

router.post('/request-otp', checkEmail)
router.post('/verify-otp', verifyOTP)
router.post('/complete-profile', verifyJWT, upload.single('img'), completeProfile)
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', verifyJWT, logoutUser)

export default router;
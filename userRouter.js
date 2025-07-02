
import express from 'express'
import { login, me, register,  } from "../controllers/userController.js"
import protect from "../middlewares/auth.js"
import upload from '../middlewares/multer.js'

const userRouter = express.Router()
userRouter.post('/register', upload.single("image"), register)
userRouter.post('/login', login)
userRouter.get('/me', protect,  me)
  

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// router.post('/upload', upload.single('image'), uploadImage);

export default userRouter
import express from 'express'
import protect from '../middlewares/auth.js'
import upload from '../middlewares/multer.js'
import { addComment, deletePost, getPosts, getPostsByUser, toggleLike, updatePost, createPost } from '../controllers/postController.js'

const postRouter = express.Router()

postRouter.post('/create', protect, upload.single('image'), createPost)
postRouter.get('/get-posts', getPosts)
postRouter.get('/user-posts', protect, getPostsByUser)
postRouter.put('/posts/:id', protect, upload.single('image'), updatePost)
postRouter.delete('/post/:id', protect, deletePost)
postRouter.put('/post/:id/like', protect, toggleLike)
postRouter.post('/post:id/comment', protect, addComment)

export default postRouter
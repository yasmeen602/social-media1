import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js'
import userRouter from './routes/userRouter.js'
import postRouter from './routes/postRouter.js'





const app = express()
const PORT = process.env.PORT || 4000
connectDB()





app.use(express.urlencoded( { extended: true } ));
app.use(express.json())

app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/posts', postRouter)

// app.get("/", (req, res) => {
//     res.send("hello")
// })
// / Place this before your routes


    

app.listen(PORT, () => {
    console.log(`server is connected: ${PORT}`)
})


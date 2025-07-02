import postModel from "../models/postSchema.js"

const createPost = async (req, res) => {
    const { text } = req.body
    try {
        const post = await postModel.create({
            user: req.user,
            text,
            image: req.file?.path
        })

        res.status(200).json({ success: true, message: "post uploaded successfully", post })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
    }
}

const getPosts = async (req, res) => {
    try {
        const posts = await postModel.find().populate('user', 'username avatar').sort({ createdAt: -1 })
        res.status(200).json({ success: true, posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
    }
}

const getPostsByUser = async (req, res) => {
    try {
        const userId = req.user
        if  (!userId) {
            return res.status(400).json({ success: false, message: "user is not authenticates" })
        }
        const posts = await postModel.find({ user: userId })

        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, message: "no posts found" })
        }
    } catch (error) {
     console.log(error)
     res.status(500).json({ success: false, message: "internal server error" })   
    }
}

const updatePost = async (req, res) => {
    const { text } = req.body
    const postId = req.params.id

    try {
        const post = await postModel.findById(postId)

        if (!post) {
            return res.status(404).json({ success: false, message: "post not found" })
        }

        if (post.user.toString() !==req.user) {
            return res.status(403).json({ succcess: false, message: "you are not authorized to update this post" })

        }

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            {
                test: test || post.text,
                image: req.file?.path || post.image
            },

            { new: true } 

        )

        res.status(200).json({ success: true, updatedPost })
    } catch (error) {

        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
        
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params?.id)

        if (!post) {
            return res.status(404).json({ success: false, message: "post not found" })
        }

        if (post.user.toString() !== req.user) {
            return res.status(403).json({ success: false, message: "you are not authorized to delete this post" })
        }
        await post.deleteOne()

        res.status(200).json({ success: true, message: "post deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
    }
}

const toggleLike = async (req, res) => {
    const postId = req.params.id
    const userId = req.user

    try {
      const post = await postModel.findById(postId) 
      
      if (!post) {
        return res.status(404).json({ success: false, message: "post not found" })
      }

      const alreadyLiked = post.likes.includes(userId)

      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString()!== userIdId.toString())
      }else {
        post.likes.push(userId)

      }

      await post.save()
      res.status(200).json({
        success: true,
        message: alreadyLiked ? "post UnLiked" : "Post Liked",
        likes: post.likes.length
      })
    } catch (error) {
       console.log(error)
       res.status(500).json({ success: false, message: "internal server error" }) 
    }

}

const addComment = async (req, res) => {
    const { id: postId } = req.params;
    const { text } = req.body
    const userId = req.user

    try {
       const post = await postModel.findById(postId)
       
       if (!post) {
        return res.status(404).json({ success: false, message: "post not found"  })
       }

       post.comment.push({ user: userId, text })

       await post.save()

       res.status(200).json({ success: true, message: "comment added successfully", comment: post.comment[post.comments.length -1 ] })

    } catch (error) {
       console.log(error)
       res.status(500).json({ success: false, message: "internal server error" }) 
    }
}

export { createPost, getPosts, getPostsByUser, updatePost, deletePost, toggleLike, addComment }
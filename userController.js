
import userModel from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
// import cloudinary from '../config/cloudinary.js';


// Helper function for token generation
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, name: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};




const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
           return res.status(401).json({ success: false, message: "all fields required" })
        }

        const avatarDP = req.file?.path;
     if (!avatarDP) {
        return res.status(400).json({ success: false, message: "avather image is required" })
     }
        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
           return res.status(401).json({ success: false, message: "user allready exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel ({
            username,
            email,
            password: hashedPassword,
            avatar: avatarDP
        })

        await newUser.save()

        const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.username  }, process.env.JWT_SECRET, {expiresIn: "7d"}) 
            
       res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
       })

       const userResponse = {
        id: newUser._id,
        username: newUser.username,
        email: email.email,
        avatar: newUser.avatar
        
       }

       res.status(200).json({ success: true, message: "Login successful", user: userResponse, token: token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "internal server error" })
    }
} 

const login = async (req, res) => {
  try {
   const { email, password } = req.body

   if (!email || !password) {
      return res.status(401).json({ success: false, mesage: "All fields required" })
   }
   const user = await userModel.findOne({ email })
   if (!user) {
      return res.status(404).json({ success: false, message: "invalid credentials" })

   }
   const token = jwt.sign({ id: user._id, email: user.email, name: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })

   res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
   })

   const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar
   }

   res.status(200).json({ success: true, message: "Login successful", user: userResponse, token: token })
   
  } catch (error) {
   console.log(error)
   res.status(500)({ success: false, message: "internal server error" })
  }
}
const me = async (req, res) => {
   try {
      const user = await userModel.findById(req.user).select("-password")
      if (!user) {
         return res.status(404).json({ success: false, message: "user not found" })

      }
      res.status(200).json({ success: true,
         currentUser: user
      })
   } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "internal server error" })  
   }
}
export const uploadImage = async (file, folder = 'uploads') => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            use_filename: true
        });
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Image upload failed');
    }
};
// Export controllers
export  { register, login, me };

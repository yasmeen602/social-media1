import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "social_medis_App",
        allowed_Format: ["jpg", "jpeg","png","mp4", "jpeg", "mov"]
    }
})
 
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5MB limit
//     },
//     fileFilter: function (req, file, cb) {
//         const filetypes = /jpeg|jpg|png/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = filetypes.test(file.mimetype);

//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb('Error: Images only!');
//         }
//     }
// });
  const upload = multer({ storage })
export default upload
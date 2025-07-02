import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters']
    },
    avatar: {
        type: String,
        default: ''
    }
}, { 
    timestamps: true 
});

// Prevent duplicate model initialization
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
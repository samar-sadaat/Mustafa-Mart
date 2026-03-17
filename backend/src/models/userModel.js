import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    phone: { type: String, default: '' },
    address: { type: Object, default: { line1: '', line2: '' } },
    gender: {
        type: String,
        enum: ["male", "female", "not selected"],
        default: "Not Selected",
    },
    dob: { type: Date },
    password: { type: String, required: true },
})

const userModel = mongoose.model("user", userSchema);
export default userModel;
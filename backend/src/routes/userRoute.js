import express from "express";
import { signup, signin, updateProfile, fetchUser, logout } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadProfileImage, resizeProfileImage } from "../middlewares/multer.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.patch("/update-profile", authMiddleware, uploadProfileImage, resizeProfileImage, updateProfile);
router.get("/user-profile", authMiddleware, fetchUser);
router.post("/logout", logout);

export default router;
import express from "express";
import { adminSignin, adminSignout, getAdminProfile } from "../controllers/adminController.js";
import { verifyAdminAuth } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/signin", adminSignin);
router.post("/signout", adminSignout);
router.get("/me", verifyAdminAuth, getAdminProfile);

export default router;
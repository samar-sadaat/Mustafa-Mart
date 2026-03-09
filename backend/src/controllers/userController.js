import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ success: false, message: "firstName and lastName, email, password required" });

    const exists = await userModel.findOne({ email }).select("-password");;
    if (exists) return res.status(409).json({ success: false, message: "Email already exists" });

    const name = `${firstName} ${lastName}`;
    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashed,
    });

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "email and password required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(user._id);

    const userData = await userModel
      .findById(user._id)
      .select("-password");

    res.cookie("token", token, {
      httpOnly: true, // cannot be accessed by JS
      secure: false, // true in production (https)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Signin successful",
      token,
      userData,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updates = {};

    /* ========================
       1️⃣ First + Last Name
    ======================== */
    const { firstName, lastName } = req.body;

    if (firstName || lastName) {
      const f = firstName?.trim() || "";
      const l = lastName?.trim() || "";
      updates.name = `${f} ${l}`.trim();
    }

    /* ========================
       2️⃣ Simple Fields
    ======================== */
    if (req.body.phone !== undefined) {
      updates.phone = req.body.phone;
    }

    if (req.body.gender !== undefined) {
      updates.gender = req.body.gender;
    }

    /* ========================
       3️⃣ Date of Birth (Date type)
    ======================== */
    if (req.body.dob) {
      const date = new Date(req.body.dob);
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date of birth",
        });
      }
      updates.dob = date;
    }

    /* ========================
       4️⃣ Address (Already Object)
    ======================== */
    if (req.body.address !== undefined) {
      const { line1 = "", line2 = "" } = req.body.address;

      updates.address = {
        line1,
        line2,
      };
    }

    /* ========================
       5️⃣ Profile Image
    ======================== */
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "mustafa-mart/users"
      );
      updates.image = result.secure_url;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    const user = await userModel.findByIdAndUpdate(userId, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated",
      user,
    });

  } catch (err) {
    
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const fetchUser = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      user
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const logout = (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ message: "Logged out" });
};
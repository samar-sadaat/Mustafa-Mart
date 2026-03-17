import jwt from "jsonwebtoken";

export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      admin: {
        email,
        role: "admin",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const adminSignout = async (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Signed out successfully",
  });
};

export const getAdminProfile = async (req, res) => {
  return res.status(200).json({
    admin: req.admin,
  });
};
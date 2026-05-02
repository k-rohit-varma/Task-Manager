import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../db/models/User.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email or password is missing.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email or password is invalid.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Email or password is invalid.",
      });
    }
    const token = jwt.sign({ data: user }, process.env.JWT_SCRECT);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // REQUIRED on HTTPS (Render uses HTTPS)
      sameSite: "none", // REQUIRED for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    req.user = user;
    return res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "User login failed",
      error: err.message,
    });
  }
};

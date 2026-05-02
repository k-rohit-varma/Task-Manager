import User from "../../db/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name ,email, password } = req.body;

    if ( !name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const checkExist = await User.findOne({ email });
    if (checkExist) {
      return res.status(400).json({
        message: "User with this email already exists.",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await User.create({
      name,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { data: result },
      process.env.JWT_SCRECT
    );
    req.user = result;
    return res
      .cookie("token", token)
      .status(201)
      .json({
        message: "User registered successfully",
        user: result,
      });

  } catch (err) {
    return res.status(500).json({
      message: "User registration failed",
      error: err.message,
    });
  }
};
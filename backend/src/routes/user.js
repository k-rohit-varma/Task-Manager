import express from "express";
import { registerUser } from "../controllers/User/register.js";
import { login } from "../controllers/User/login.js";
import { me } from "../controllers/User/me.js";
import { logout } from "../controllers/User/logout.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.get("/me", me);
userRouter.post("/logout",logout)

export default userRouter;

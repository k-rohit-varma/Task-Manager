import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./db/connect.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import projectRouter from "./routes/project.js";
import taskRouter from "./routes/task.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  process.env.FRONT_END_URL ||
  "http://localhost:5173";

connectDB();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      "https://task-manager-52d7.onrender.com" || process.env.FRONT_END_URL,
    credentials: true,
  }),
);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/task", taskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

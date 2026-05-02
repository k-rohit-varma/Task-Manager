import jwt from "jsonwebtoken";

export const adminMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SCRECT);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (decoded.data.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized" + err,
    });
  }
};

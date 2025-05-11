import jwt from "jsonwebtoken";
import Auth from "../model/auth.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // get token from header
    const token = req.headers("Authorization").replace("Bearer", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if user exist
    const user = await Auth.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "invlaid token" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token" });
  }
};

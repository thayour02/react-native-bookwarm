import jwt from "jsonwebtoken";
import Auth from "../model/auth.js";



export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    // check if token exist
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if user exist
    const user = await Auth.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });

// attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

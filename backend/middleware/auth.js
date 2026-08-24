import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the app-issued JWT sent as "Authorization: Bearer <token>"
// and attaches the corresponding user to req.user. Every task route
// uses this so a user can only ever read or modify their own tasks.
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, token invalid or expired" });
  }
};

import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "Not authorized. Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.json({ success: false, message: "Invalid token." });
    }

    // Attach user to request for controller use
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;

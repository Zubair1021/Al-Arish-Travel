import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Admin } from "../models/Admin.js";

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

export async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.sub);
    if (!admin) {
      return res.status(401).json({ message: "Admin no longer exists" });
    }
    req.admin = admin;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

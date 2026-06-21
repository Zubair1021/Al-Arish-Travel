import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Admin } from "../models/Admin.js";
import { requireAdmin, signAdminToken } from "../middleware/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." },
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const ok = await admin.verifyPassword(password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken(admin);
  return res.json({
    token,
    admin: admin.toSafeJSON(),
  });
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: req.admin.toSafeJSON() });
});

router.post("/change-password", requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }

  const ok = await req.admin.verifyPassword(currentPassword);
  if (!ok) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  req.admin.passwordHash = await Admin.hashPassword(newPassword);
  await req.admin.save();
  res.json({ message: "Password updated" });
});

export default router;

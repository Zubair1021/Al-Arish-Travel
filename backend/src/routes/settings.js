import { Router } from "express";
import { Settings } from "../models/Settings.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/public", async (_req, res) => {
  const doc = await Settings.getSingleton();
  res.json({ settings: doc.toPublicJSON() });
});

router.get("/", requireAdmin, async (_req, res) => {
  const doc = await Settings.getSingleton();
  res.json({ settings: doc.toPublicJSON() });
});

router.put("/", requireAdmin, async (req, res) => {
  const body = req.body || {};
  const doc = await Settings.getSingleton();

  const stringFields = [
    "siteName",
    "tagline",
    "email",
    "phone",
    "address",
    "businessHours",
    "whatsappNumber",
    "whatsappMessage",
  ];
  for (const field of stringFields) {
    if (typeof body[field] === "string") {
      doc[field] = body[field].trim();
    }
  }

  if (body.socials && typeof body.socials === "object") {
    doc.socials = {
      facebook: String(body.socials.facebook || "").trim(),
      instagram: String(body.socials.instagram || "").trim(),
      twitter: String(body.socials.twitter || "").trim(),
      youtube: String(body.socials.youtube || "").trim(),
    };
  }

  if (doc.whatsappNumber) {
    doc.whatsappNumber = doc.whatsappNumber.replace(/[^0-9]/g, "");
  }
  if (doc.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doc.email)) {
    return res.status(400).json({ message: "A valid email is required" });
  }

  await doc.save();
  res.json({ settings: doc.toPublicJSON() });
});

export default router;

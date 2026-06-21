import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  SUBMISSION_STATUSES,
  SUBMISSION_TYPES,
  Submission,
} from "../models/Submission.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." },
});

function pickMeta(req) {
  return {
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip,
  };
}

function validateBase(body) {
  const errors = [];
  if (!body.name || String(body.name).trim().length < 2) {
    errors.push("Name is required");
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
    errors.push("A valid email is required");
  }
  return errors;
}

router.post("/quote", submitLimiter, async (req, res) => {
  const body = req.body || {};
  const errors = validateBase(body);
  if (errors.length) return res.status(400).json({ message: errors.join("; ") });

  const submission = await Submission.create({
    type: "quote",
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
    packageSlug: body.packageSlug,
    packageName: body.packageName,
    packageDuration: body.packageDuration,
    packagePrice: body.packagePrice,
    meta: pickMeta(req),
  });
  res.status(201).json({ id: submission._id, message: "Quote received" });
});

router.post("/contact", submitLimiter, async (req, res) => {
  const body = req.body || {};
  const errors = validateBase(body);
  if (errors.length) return res.status(400).json({ message: errors.join("; ") });

  const submission = await Submission.create({
    type: "contact",
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
    meta: pickMeta(req),
  });
  res.status(201).json({ id: submission._id, message: "Message received" });
});

router.post("/hajj", submitLimiter, async (req, res) => {
  const body = req.body || {};
  const errors = validateBase(body);
  if (errors.length) return res.status(400).json({ message: errors.join("; ") });

  const submission = await Submission.create({
    type: "hajj",
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
    pilgrims: body.pilgrims,
    hajjYear: Number(body.hajjYear) || undefined,
    meta: pickMeta(req),
  });
  res.status(201).json({ id: submission._id, message: "Registration received" });
});

// ---- Admin ----

router.get("/", requireAdmin, async (req, res) => {
  const { type, status, search, limit = "100" } = req.query;
  const filter = {};
  if (type && SUBMISSION_TYPES.includes(String(type))) filter.type = String(type);
  if (status && SUBMISSION_STATUSES.includes(String(status))) {
    filter.status = String(status);
  }
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { message: rx }];
  }
  const docs = await Submission.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 100, 500));
  res.json({ submissions: docs.map((d) => d.toAdminJSON()) });
});

router.get("/summary", requireAdmin, async (_req, res) => {
  const [byType, byStatus, unread, total] = await Promise.all([
    Submission.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
    Submission.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Submission.countDocuments({ read: false }),
    Submission.countDocuments(),
  ]);
  res.json({
    total,
    unread,
    byType: Object.fromEntries(byType.map((row) => [row._id, row.count])),
    byStatus: Object.fromEntries(byStatus.map((row) => [row._id, row.count])),
  });
});

router.get("/recent", requireAdmin, async (req, res) => {
  const after = req.query.after ? new Date(String(req.query.after)) : null;
  const filter = {};
  if (after && !Number.isNaN(after.getTime())) {
    filter.createdAt = { $gt: after };
  }
  const docs = await Submission.find(filter)
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ submissions: docs.map((d) => d.toAdminJSON()) });
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  if (!SUBMISSION_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `status must be one of ${SUBMISSION_STATUSES.join(", ")}`,
    });
  }
  const doc = await Submission.findByIdAndUpdate(
    req.params.id,
    { status, read: true },
    { new: true },
  );
  if (!doc) return res.status(404).json({ message: "Submission not found" });
  res.json({ submission: doc.toAdminJSON() });
});

router.patch("/:id/read", requireAdmin, async (req, res) => {
  const doc = await Submission.findByIdAndUpdate(
    req.params.id,
    { read: !!req.body?.read },
    { new: true },
  );
  if (!doc) return res.status(404).json({ message: "Submission not found" });
  res.json({ submission: doc.toAdminJSON() });
});

router.patch("/:id/notes", requireAdmin, async (req, res) => {
  const notes = String(req.body?.adminNotes || "");
  const doc = await Submission.findByIdAndUpdate(
    req.params.id,
    { adminNotes: notes },
    { new: true },
  );
  if (!doc) return res.status(404).json({ message: "Submission not found" });
  res.json({ submission: doc.toAdminJSON() });
});

router.post("/mark-all-read", requireAdmin, async (_req, res) => {
  await Submission.updateMany({ read: false }, { read: true });
  res.json({ message: "All marked as read" });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const doc = await Submission.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Submission not found" });
  res.json({ message: "Deleted" });
});

export default router;

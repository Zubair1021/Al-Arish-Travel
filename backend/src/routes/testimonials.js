import { Router } from "express";
import { Testimonial } from "../models/Testimonial.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

function validateBody(body, { partial = false } = {}) {
  const errors = [];
  if (!partial) {
    if (!String(body.name || "").trim()) errors.push("name is required");
    if (!String(body.location || "").trim()) errors.push("location is required");
    if (!String(body.review || "").trim()) errors.push("review is required");
  }
  if (body.name !== undefined && !String(body.name).trim()) {
    errors.push("name cannot be empty");
  }
  if (body.location !== undefined && !String(body.location).trim()) {
    errors.push("location cannot be empty");
  }
  if (body.review !== undefined && !String(body.review).trim()) {
    errors.push("review cannot be empty");
  }
  if (body.rating !== undefined) {
    const rating = Number(body.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      errors.push("rating must be between 1 and 5");
    }
  }
  if (body.photo !== undefined && body.photo) {
    if (!/^https?:\/\//i.test(String(body.photo).trim())) {
      errors.push("photo must be a valid http(s) URL");
    }
  }
  return errors;
}

router.get("/public", async (_req, res) => {
  const testimonials = await Testimonial.find({ hidden: { $ne: true } }).sort({
    sortOrder: 1,
    createdAt: 1,
  });
  res.json({
    testimonials: testimonials.map((t) => t.toPublicJSON()),
  });
});

router.get("/", requireAdmin, async (_req, res) => {
  const testimonials = await Testimonial.find().sort({ sortOrder: 1, createdAt: 1 });
  res.json({
    testimonials: testimonials.map((t) => t.toAdminJSON()),
  });
});

router.post("/", requireAdmin, async (req, res) => {
  const body = req.body || {};
  const errors = validateBody(body);
  if (errors.length) return res.status(400).json({ message: errors.join("; ") });

  const testimonial = await Testimonial.create({
    name: body.name.trim(),
    location: body.location.trim(),
    rating: Number(body.rating) || 5,
    review: body.review.trim(),
    photo: body.photo?.trim() || "",
    accentPrimary: body.accentPrimary?.trim() || "#1f6b50",
    accentSecondary: body.accentSecondary?.trim() || "#0d3326",
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    hidden: !!body.hidden,
  });

  res.status(201).json({ testimonial: testimonial.toAdminJSON() });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

  const body = req.body || {};
  const errors = validateBody(body, { partial: true });
  if (errors.length) return res.status(400).json({ message: errors.join("; ") });

  const fields = [
    "name",
    "location",
    "review",
    "photo",
    "accentPrimary",
    "accentSecondary",
    "hidden",
    "sortOrder",
  ];
  for (const field of fields) {
    if (body[field] !== undefined) {
      testimonial[field] =
        typeof body[field] === "string" ? body[field].trim() : body[field];
    }
  }
  if (body.rating !== undefined) testimonial.rating = Number(body.rating);

  await testimonial.save();
  res.json({ testimonial: testimonial.toAdminJSON() });
});

router.patch("/:id/visibility", requireAdmin, async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
  testimonial.hidden = !!req.body?.hidden;
  await testimonial.save();
  res.json({ testimonial: testimonial.toAdminJSON() });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
  res.json({ message: "Deleted" });
});

export default router;

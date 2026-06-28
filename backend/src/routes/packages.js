import { Router } from "express";
import { PACKAGE_IMAGE_PRESETS, Package } from "../models/Package.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  categoryExists,
  getAdminCategoryOptions,
  getPublicCategoryOptions,
} from "../utils/categoryHelpers.js";

const router = Router();

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function ensureUniqueSlug(base, ignoreId) {
  let slug = base || `package-${Date.now()}`;
  let i = 1;
  while (true) {
    const existing = await Package.findOne({ slug });
    if (!existing || (ignoreId && existing._id.equals(ignoreId))) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

async function validateBody(body, { partial = false } = {}) {
  const errors = [];
  const requiredFields = ["name", "category", "duration", "shortDescription", "price", "imageValue"];
  if (!partial) {
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        errors.push(`${field} is required`);
      }
    }
  }
  if (body.category !== undefined) {
    const valid = await categoryExists(body.category);
    if (!valid) {
      errors.push("category must match an existing package category");
    }
  }
  if (body.imageKind !== undefined && !["preset", "url"].includes(body.imageKind)) {
    errors.push("imageKind must be 'preset' or 'url'");
  }
  if (body.imageKind === "preset" && body.imageValue !== undefined) {
    if (!PACKAGE_IMAGE_PRESETS.includes(body.imageValue)) {
      errors.push(
        `imageValue for preset must be one of: ${PACKAGE_IMAGE_PRESETS.join(", ")}`,
      );
    }
  }
  if (body.imageKind === "url" && body.imageValue !== undefined) {
    if (!/^https?:\/\//i.test(body.imageValue)) {
      errors.push("imageValue for url must be a valid http(s) link");
    }
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) {
      errors.push("price must be a positive number");
    }
  }
  return errors;
}

router.get("/public", async (_req, res) => {
  const packages = await Package.find({ hidden: { $ne: true } }).sort({
    sortOrder: 1,
    createdAt: 1,
  });
  const categories = await getPublicCategoryOptions();
  res.json({
    packages: packages.map((p) => p.toPublicJSON()),
    categories,
  });
});

router.get("/", requireAdmin, async (_req, res) => {
  const packages = await Package.find().sort({ sortOrder: 1, createdAt: 1 });
  const categories = await getAdminCategoryOptions();
  res.json({
    packages: packages.map((p) => p.toAdminJSON()),
    presets: PACKAGE_IMAGE_PRESETS,
    categories,
    featuredLimit: 4,
  });
});

router.post("/", requireAdmin, async (req, res) => {
  const body = req.body || {};
  body.imageKind = body.imageKind || "preset";
  const errors = await validateBody(body);
  if (errors.length) return res.status(400).json({ message: errors.join("; ") });

  const slug = await ensureUniqueSlug(body.slug || slugify(body.name));

  const featured = !!body.featured;
  if (featured) {
    const featuredCount = await Package.countDocuments({ featured: true });
    if (featuredCount >= 4) {
      return res.status(400).json({
        message: "Only 4 packages can be featured. Unfeature one first.",
      });
    }
  }

  const pkg = await Package.create({
    slug,
    name: body.name.trim(),
    category: body.category,
    tag: body.tag?.trim() || "",
    imageKind: body.imageKind,
    imageValue: body.imageValue,
    duration: body.duration.trim(),
    shortDescription: body.shortDescription.trim(),
    price: Number(body.price),
    currency: body.currency?.trim() || "£",
    featured,
    hidden: !!body.hidden,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  });

  res.status(201).json({ package: pkg.toAdminJSON() });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });

  const body = req.body || {};
  const errors = await validateBody(body, { partial: true });
  if (errors.length) return res.status(400).json({ message: errors.join("; ") });

  if (body.featured === true && !pkg.featured) {
    const featuredCount = await Package.countDocuments({ featured: true });
    if (featuredCount >= 4) {
      return res.status(400).json({
        message: "Only 4 packages can be featured. Unfeature one first.",
      });
    }
  }

  const fields = [
    "name",
    "category",
    "tag",
    "imageKind",
    "imageValue",
    "duration",
    "shortDescription",
    "currency",
    "featured",
    "hidden",
    "sortOrder",
  ];
  for (const field of fields) {
    if (body[field] !== undefined) {
      pkg[field] =
        field === "price"
          ? Number(body[field])
          : typeof body[field] === "string"
            ? body[field].trim()
            : body[field];
    }
  }
  if (body.price !== undefined) pkg.price = Number(body.price);

  if (body.name && !body.slug) {
    pkg.slug = await ensureUniqueSlug(slugify(body.name), pkg._id);
  } else if (body.slug) {
    pkg.slug = await ensureUniqueSlug(slugify(body.slug), pkg._id);
  }

  await pkg.save();
  res.json({ package: pkg.toAdminJSON() });
});

router.patch("/:id/visibility", requireAdmin, async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  pkg.hidden = !!req.body?.hidden;
  await pkg.save();
  res.json({ package: pkg.toAdminJSON() });
});

router.patch("/:id/featured", requireAdmin, async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  const wantFeatured = !!req.body?.featured;
  if (wantFeatured && !pkg.featured) {
    const featuredCount = await Package.countDocuments({ featured: true });
    if (featuredCount >= 4) {
      return res.status(400).json({
        message: "Only 4 packages can be featured. Unfeature one first.",
      });
    }
  }
  pkg.featured = wantFeatured;
  await pkg.save();
  res.json({ package: pkg.toAdminJSON() });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const pkg = await Package.findByIdAndDelete(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  res.json({ message: "Deleted" });
});

export default router;

import { Router } from "express";
import { Package } from "../models/Package.js";
import { PackageCategory } from "../models/PackageCategory.js";
import { requireAdmin } from "../middleware/auth.js";
import {
  categoryExists,
  ensureUniqueCategorySlug,
  getPublicCategoryOptions,
  slugifyCategory,
} from "../utils/categoryHelpers.js";

const router = Router();

router.get("/public", async (_req, res) => {
  const categories = await getPublicCategoryOptions();
  res.json({ categories });
});

router.get("/", requireAdmin, async (_req, res) => {
  const categories = await PackageCategory.find().sort({ sortOrder: 1, createdAt: 1 });
  const counts = await Package.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((row) => [row._id, row.count]));

  res.json({
    categories: categories.map((cat) => ({
      ...cat.toAdminJSON(),
      packageCount: countMap[cat.slug] || 0,
    })),
  });
});

router.post("/", requireAdmin, async (req, res) => {
  const body = req.body || {};
  const label = String(body.label || "").trim();
  if (!label) {
    return res.status(400).json({ message: "label is required" });
  }

  const slug = await ensureUniqueCategorySlug(
    slugifyCategory(body.slug || label),
  );

  const category = await PackageCategory.create({
    slug,
    label,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    hidden: !!body.hidden,
  });

  res.status(201).json({ category: category.toAdminJSON() });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const category = await PackageCategory.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const body = req.body || {};
  if (body.label !== undefined) {
    const label = String(body.label).trim();
    if (!label) return res.status(400).json({ message: "label cannot be empty" });
    category.label = label;
  }
  if (body.sortOrder !== undefined) {
    category.sortOrder = Number(body.sortOrder) || 0;
  }
  if (body.hidden !== undefined) {
    category.hidden = !!body.hidden;
  }
  if (body.slug !== undefined) {
    const nextSlug = await ensureUniqueCategorySlug(
      slugifyCategory(body.slug),
      category._id,
    );
    const oldSlug = category.slug;
    if (nextSlug !== oldSlug) {
      await Package.updateMany({ category: oldSlug }, { category: nextSlug });
      category.slug = nextSlug;
    }
  }

  await category.save();
  res.json({ category: category.toAdminJSON() });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const category = await PackageCategory.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const packageCount = await Package.countDocuments({ category: category.slug });
  if (packageCount > 0) {
    return res.status(400).json({
      message: `Cannot delete — ${packageCount} package(s) still use this category. Reassign them first.`,
    });
  }

  await category.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;

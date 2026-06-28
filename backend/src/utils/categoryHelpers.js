import { PackageCategory } from "../models/PackageCategory.js";

export function slugifyCategory(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function ensureUniqueCategorySlug(base, ignoreId) {
  let slug = base || `category-${Date.now()}`;
  let i = 1;
  while (true) {
    const existing = await PackageCategory.findOne({ slug });
    if (!existing || (ignoreId && existing._id.equals(ignoreId))) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
}

export async function getPublicCategoryOptions() {
  const categories = await PackageCategory.find({ hidden: { $ne: true } }).sort({
    sortOrder: 1,
    createdAt: 1,
  });
  return [
    { id: "all", label: "All Packages" },
    ...categories.map((cat) => cat.toPublicJSON()),
  ];
}

export async function getAdminCategoryOptions() {
  const categories = await PackageCategory.find().sort({ sortOrder: 1, createdAt: 1 });
  return categories.map((cat) => ({
    value: cat.slug,
    label: cat.label,
    hidden: cat.hidden,
  }));
}

export async function categoryExists(slug) {
  if (!slug) return false;
  const cat = await PackageCategory.findOne({ slug: String(slug).trim() });
  return !!cat;
}

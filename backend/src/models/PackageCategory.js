import mongoose from "mongoose";

const packageCategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

packageCategorySchema.methods.toPublicJSON = function () {
  return {
    id: this.slug,
    label: this.label,
  };
};

packageCategorySchema.methods.toAdminJSON = function () {
  return {
    _id: this._id.toString(),
    slug: this.slug,
    label: this.label,
    sortOrder: this.sortOrder,
    hidden: this.hidden,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const PackageCategory = mongoose.model("PackageCategory", packageCategorySchema);

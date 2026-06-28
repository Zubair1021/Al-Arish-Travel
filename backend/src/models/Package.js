import mongoose from "mongoose";

export const PACKAGE_IMAGE_PRESETS = [
  "pkg-4star",
  "pkg-5star",
  "pkg-ramadan",
  "pkg-family",
];

const packageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tag: { type: String, trim: true },
    imageKind: {
      type: String,
      enum: ["preset", "url"],
      default: "preset",
    },
    imageValue: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "£", trim: true },
    featured: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

packageSchema.methods.toPublicJSON = function () {
  return {
    id: this.slug,
    name: this.name,
    category: this.category,
    tag: this.tag || undefined,
    imageKind: this.imageKind,
    imageValue: this.imageValue,
    duration: this.duration,
    shortDescription: this.shortDescription,
    price: this.price,
    currency: this.currency,
    featured: this.featured,
  };
};

packageSchema.methods.toAdminJSON = function () {
  return {
    _id: this._id.toString(),
    slug: this.slug,
    name: this.name,
    category: this.category,
    tag: this.tag || "",
    imageKind: this.imageKind,
    imageValue: this.imageValue,
    duration: this.duration,
    shortDescription: this.shortDescription,
    price: this.price,
    currency: this.currency,
    featured: this.featured,
    hidden: this.hidden,
    sortOrder: this.sortOrder,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Package = mongoose.model("Package", packageSchema);

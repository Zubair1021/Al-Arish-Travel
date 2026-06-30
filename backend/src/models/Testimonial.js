import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    review: { type: String, required: true, trim: true },
    photo: { type: String, trim: true, default: "" },
    accentPrimary: { type: String, required: true, trim: true, default: "#1f6b50" },
    accentSecondary: { type: String, required: true, trim: true, default: "#0d3326" },
    sortOrder: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

testimonialSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    location: this.location,
    rating: this.rating,
    review: this.review,
    photo: this.photo || undefined,
    accent: [this.accentPrimary, this.accentSecondary],
  };
};

testimonialSchema.methods.toAdminJSON = function () {
  return {
    _id: this._id.toString(),
    name: this.name,
    location: this.location,
    rating: this.rating,
    review: this.review,
    photo: this.photo || "",
    accentPrimary: this.accentPrimary,
    accentSecondary: this.accentSecondary,
    sortOrder: this.sortOrder,
    hidden: this.hidden,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);

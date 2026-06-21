import mongoose from "mongoose";

export const SUBMISSION_TYPES = ["quote", "contact", "hajj"];
export const SUBMISSION_STATUSES = [
  "new",
  "in_progress",
  "contacted",
  "converted",
  "closed",
];

const submissionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: SUBMISSION_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: SUBMISSION_STATUSES,
      default: "new",
    },
    read: { type: Boolean, default: false },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },

    packageSlug: { type: String, trim: true },
    packageName: { type: String, trim: true },
    packageDuration: { type: String, trim: true },
    packagePrice: { type: String, trim: true },

    pilgrims: { type: String, trim: true },
    hajjYear: { type: Number },

    adminNotes: { type: String, default: "" },

    meta: {
      userAgent: String,
      ip: String,
    },
  },
  { timestamps: true },
);

submissionSchema.index({ createdAt: -1 });
submissionSchema.index({ status: 1, type: 1 });

submissionSchema.methods.toAdminJSON = function () {
  return {
    _id: this._id.toString(),
    type: this.type,
    status: this.status,
    read: this.read,
    name: this.name,
    email: this.email,
    phone: this.phone,
    message: this.message,
    packageSlug: this.packageSlug,
    packageName: this.packageName,
    packageDuration: this.packageDuration,
    packagePrice: this.packagePrice,
    pilgrims: this.pilgrims,
    hajjYear: this.hajjYear,
    adminNotes: this.adminNotes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Submission = mongoose.model("Submission", submissionSchema);

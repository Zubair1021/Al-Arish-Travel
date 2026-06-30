import mongoose from "mongoose";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Package } from "./models/Package.js";
import { PackageCategory } from "./models/PackageCategory.js";
import { Settings } from "./models/Settings.js";
import { Testimonial } from "./models/Testimonial.js";

const seedCategories = [
  { slug: "5-star-umrah", label: "5 Star Umrah", sortOrder: 1 },
  { slug: "4-star-umrah", label: "4 Star Umrah", sortOrder: 2 },
  { slug: "family-umrah", label: "Family Umrah", sortOrder: 3 },
  { slug: "december-umrah", label: "December Umrah", sortOrder: 4 },
];

const legacyCategoryMap = {
  "4-star": "4-star-umrah",
  "5-star": "5-star-umrah",
  family: "family-umrah",
  ramadan: "december-umrah",
};

const seedPackages = [
  {
    slug: "umrah-4-star",
    name: "4-Star Umrah",
    category: "4-star-umrah",
    tag: "Best Value",
    imageKind: "preset",
    imageValue: "pkg-4star",
    duration: "10 Nights",
    shortDescription:
      "Comfortable 4-star hotels within walking distance of the Haram, including flights and transfers.",
    price: 945,
    currency: "£",
    featured: true,
    sortOrder: 1,
  },
  {
    slug: "umrah-5-star",
    name: "5-Star Umrah",
    category: "5-star-umrah",
    tag: "Premium",
    imageKind: "preset",
    imageValue: "pkg-5star",
    duration: "10 Nights",
    shortDescription:
      "Luxury Haram-view hotels with premium hospitality, flights and private transfers throughout.",
    price: 1495,
    currency: "£",
    featured: true,
    sortOrder: 2,
  },
  {
    slug: "umrah-ramadan",
    name: "Ramadan Umrah",
    category: "december-umrah",
    tag: "Limited Seats",
    imageKind: "preset",
    imageValue: "pkg-ramadan",
    duration: "14 Nights",
    shortDescription:
      "Spend the blessed nights of Ramadan in Makkah and Madinah with our specially curated package.",
    price: 1850,
    currency: "£",
    featured: true,
    sortOrder: 3,
  },
  {
    slug: "umrah-family",
    name: "Family Package",
    category: "family-umrah",
    tag: "Family",
    imageKind: "preset",
    imageValue: "pkg-family",
    duration: "12 Nights",
    shortDescription:
      "Spacious family rooms, child-friendly schedules and dedicated support for elderly travellers.",
    price: 1295,
    currency: "£",
    featured: true,
    sortOrder: 4,
  },
];

const seedTestimonials = [
  {
    name: "Ahmed Khan",
    location: "London, UK",
    rating: 5,
    review:
      "From visa to flights, everything was handled flawlessly. Our 5-star Umrah felt truly effortless and spiritual. May Allah reward the whole team.",
    accentPrimary: "#1f6b50",
    accentSecondary: "#0d3326",
    sortOrder: 1,
  },
  {
    name: "Fatima Begum",
    location: "Birmingham, UK",
    rating: 5,
    review:
      "The hotel was just steps from the Haram and the support was available day and night. I felt cared for at every single step of my journey.",
    accentPrimary: "#cf9b3a",
    accentSecondary: "#9a6f1f",
    sortOrder: 2,
  },
  {
    name: "Yusuf Patel",
    location: "Leicester, UK",
    rating: 5,
    review:
      "As a first-time pilgrim I had a hundred questions. Their scholars guided me with so much patience. Highly recommend Al Arish Travel.",
    accentPrimary: "#2a7d8c",
    accentSecondary: "#13414a",
    sortOrder: 3,
  },
  {
    name: "Aisha Rahman",
    location: "Manchester, UK",
    rating: 5,
    review:
      "We booked the family package and the kids were looked after beautifully. Stress-free, organised and genuinely warm people to deal with.",
    accentPrimary: "#b5683f",
    accentSecondary: "#7c3f1f",
    sortOrder: 4,
  },
  {
    name: "Bilal Ahmed",
    location: "Bradford, UK",
    rating: 5,
    review:
      "Direct flights and smooth transfers made all the difference. Transparent pricing with no hidden costs. Will definitely travel with them again.",
    accentPrimary: "#3b6db5",
    accentSecondary: "#1f3f7c",
    sortOrder: 5,
  },
];

export async function ensureAdmin() {
  const existing = await Admin.findOne({ email: env.adminEmail.toLowerCase() });
  if (existing) {
    return existing;
  }
  const passwordHash = await Admin.hashPassword(env.adminPassword);
  const admin = await Admin.create({
    email: env.adminEmail.toLowerCase(),
    passwordHash,
    name: "Administrator",
  });
  console.log(`[seed] Created admin user: ${admin.email}`);
  return admin;
}

export async function ensureCategories() {
  for (const data of seedCategories) {
    const existing = await PackageCategory.findOne({ slug: data.slug });
    if (!existing) {
      await PackageCategory.create(data);
      console.log(`[seed] Created category: ${data.slug}`);
    }
  }

  for (const [legacy, next] of Object.entries(legacyCategoryMap)) {
    const result = await Package.updateMany({ category: legacy }, { category: next });
    if (result.modifiedCount > 0) {
      console.log(`[seed] Migrated ${result.modifiedCount} package(s) from ${legacy} → ${next}`);
    }
  }
}

export async function ensurePackages() {
  for (const data of seedPackages) {
    const existing = await Package.findOne({ slug: data.slug });
    if (!existing) {
      await Package.create(data);
      console.log(`[seed] Created package: ${data.slug}`);
    }
  }
}

export async function ensureTestimonials() {
  if ((await Testimonial.countDocuments()) > 0) return;

  for (const data of seedTestimonials) {
    await Testimonial.create(data);
    console.log(`[seed] Created testimonial: ${data.name}`);
  }
}

export async function ensureSettings() {
  const settings = await Settings.getSingleton();
  console.log(`[seed] Settings ready (${settings._id})`);
}

export async function runSeed() {
  await ensureAdmin();
  await ensureCategories();
  await ensurePackages();
  await ensureTestimonials();
  await ensureSettings();
}

const isDirectRun = process.argv[1] && process.argv[1].endsWith("seed.js");
if (isDirectRun) {
  (async () => {
    try {
      await connectDB();
      await runSeed();
      console.log("[seed] Done");
    } catch (error) {
      console.error("[seed] Failed:", error);
      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();
    }
  })();
}

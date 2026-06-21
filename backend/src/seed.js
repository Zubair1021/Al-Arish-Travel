import mongoose from "mongoose";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Package } from "./models/Package.js";
import { Settings } from "./models/Settings.js";

const seedPackages = [
  {
    slug: "umrah-4-star",
    name: "4-Star Umrah",
    category: "4-star",
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
    category: "5-star",
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
    category: "ramadan",
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
    category: "family",
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

export async function ensurePackages() {
  for (const data of seedPackages) {
    const existing = await Package.findOne({ slug: data.slug });
    if (!existing) {
      await Package.create(data);
      console.log(`[seed] Created package: ${data.slug}`);
    }
  }
}

export async function ensureSettings() {
  const settings = await Settings.getSingleton();
  console.log(`[seed] Settings ready (${settings._id})`);
}

export async function runSeed() {
  await ensureAdmin();
  await ensurePackages();
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

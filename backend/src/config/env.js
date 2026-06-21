import dotenv from "dotenv";

dotenv.config();

function required(name, fallback) {
  const value = process.env[name];
  if (!value && fallback === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || fallback;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/alarish"),
  mongoDbName: process.env.MONGODB_DB || "alarish",
  jwtSecret: required("JWT_SECRET", "dev-only-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  adminEmail: process.env.ADMIN_EMAIL || "uzmanadmin@gmail.com",
  adminPassword: process.env.ADMIN_PASSWORD || "admin@12345",
};

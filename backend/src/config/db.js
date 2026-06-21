import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      dbName: env.mongoDbName,
    });
    const dbName = mongoose.connection?.db?.databaseName || env.mongoDbName;
    console.log(`[db] Connected to MongoDB (database: ${dbName})`);
  } catch (error) {
    console.error("[db] Connection failed:", error.message);
    throw error;
  }
}

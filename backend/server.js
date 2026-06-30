import express from "express";
import cors from "cors";
import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import { runSeed } from "./src/seed.js";
import authRoutes from "./src/routes/auth.js";
import categoryRoutes from "./src/routes/categories.js";
import packageRoutes from "./src/routes/packages.js";
import submissionRoutes from "./src/routes/submissions.js";
import settingsRoutes from "./src/routes/settings.js";
import testimonialRoutes from "./src/routes/testimonials.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (env.corsOrigin.includes("*") || env.corsOrigin.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use(notFound);
app.use(errorHandler);

async function main() {
  await connectDB();
  await runSeed();
  app.listen(env.port, () => {
    console.log(`[server] API listening on http://localhost:${env.port}`);
  });
}

main().catch((error) => {
  console.error("[server] Failed to start:", error);
  process.exit(1);
});

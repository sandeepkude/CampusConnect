import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import applicationRoutes from "./routes/applications.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "CampusConnect API" }));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof Error && (err.name === "MulterError" || /Resume must be|File too large/i.test(err.message))) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Resume must be 5 MB or smaller." : err.message;
    return res.status(400).json({ message });
  }
  console.error(err);
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID format." });
  res.status(500).json({ message: "Server error. Check the backend terminal for details." });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`CampusConnect API running on http://localhost:${port}`)))
  .catch(err => { console.error("Could not start backend:", err.message); process.exit(1); });

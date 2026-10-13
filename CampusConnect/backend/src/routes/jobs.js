import { Router } from "express";
import Job from "../models/Job.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search = "", location = "", type = "" } = req.query;
    const filter = {};
    if (search.trim()) filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { company: { $regex: search.trim(), $options: "i" } },
      { skills: { $regex: search.trim(), $options: "i" } }
    ];
    if (location.trim()) filter.location = { $regex: location.trim(), $options: "i" };
    if (type) filter.jobType = type;
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).populate("createdBy", "name");
    res.json({ jobs });
  } catch (err) { next(err); }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const { title, company, location, jobType, description, skills = [], eligibility, deadline } = req.body;
    if (!title?.trim() || !company?.trim() || !location?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Title, company, location, and description are required." });
    }
    const job = await Job.create({ title, company, location, jobType, description, skills: Array.isArray(skills) ? skills : String(skills).split(",").map(s => s.trim()).filter(Boolean), eligibility, deadline: deadline || null, createdBy: req.user.id });
    res.status(201).json({ job });
  } catch (err) { next(err); }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates._id; delete updates.createdBy;
    if (typeof updates.skills === "string") updates.skills = updates.skills.split(",").map(s => s.trim()).filter(Boolean);
    const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ job });
  } catch (err) { next(err); }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json({ message: "Job deleted." });
  } catch (err) { next(err); }
});

export default router;

import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage, limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = {
      ".pdf": ["application/pdf", "application/octet-stream"],
      ".doc": ["application/msword", "application/octet-stream"],
      ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream"]
    };
    if (allowed[ext] && allowed[ext].includes(file.mimetype)) return cb(null, true);
    cb(new Error("Resume must be a PDF, DOC, or DOCX file."));
  }
});

router.post("/:jobId", requireAuth, requireRole("student"), upload.single("resume"), async (req, res, next) => {
  try {
    const { applicantName, applicantEmail, phone, department, graduationYear, coverLetter } = req.body;
    if (!req.file) return res.status(400).json({ message: "Please attach your resume (PDF, DOC, or DOCX; maximum 5 MB)." });
    // Check the file signature as a second layer beyond the browser-provided extension/MIME type.
    const signature = Buffer.alloc(8);
    const fd = fs.openSync(req.file.path, "r");
    try { fs.readSync(fd, signature, 0, 8, 0); } finally { fs.closeSync(fd); }
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isPdf = ext === ".pdf" && signature.subarray(0, 5).toString() === "%PDF-";
    const isDoc = ext === ".doc" && signature.subarray(0, 4).equals(Buffer.from([0xD0, 0xCF, 0x11, 0xE0]));
    const isDocx = ext === ".docx" && signature.subarray(0, 2).toString() === "PK";
    if (!(isPdf || isDoc || isDocx)) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "The uploaded file does not appear to match its extension. Please choose a valid PDF, DOC, or DOCX resume." });
    }
    if (!applicantName?.trim() || !applicantEmail?.trim() || !phone?.trim()) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Full name, email, and phone number are required." });
    }
    const job = await Job.findById(req.params.jobId);
    if (!job) { fs.unlink(req.file.path, () => {}); return res.status(404).json({ message: "Job not found." }); }
    const application = await Application.create({
      student: req.user.id, job: job._id, applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim().toLowerCase(), phone: phone.trim(),
      department: (department || "").trim(), graduationYear: graduationYear ? Number(graduationYear) : null,
      resumeFileName: req.file.filename, resumeOriginalName: req.file.originalname,
      coverLetter: (coverLetter || "").trim()
    });
    res.status(201).json({ application, message: "Application submitted successfully." });
  } catch (err) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    if (err.code === 11000) return res.status(409).json({ message: "You have already applied to this job." });
    next(err);
  }
});

router.get("/mine", requireAuth, requireRole("student"), async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user.id }).sort({ createdAt: -1 }).populate("job");
    res.json({ applications });
  } catch (err) { next(err); }
});

router.get("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 }).populate("student", "name email department graduationYear").populate("job", "title company");
    res.json({ applications });
  } catch (err) { next(err); }
});

router.get("/:id/resume", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found." });
    const filePath = path.join(uploadDir, path.basename(application.resumeFileName));
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Resume file was not found on the server." });
    res.download(filePath, application.resumeOriginalName);
  } catch (err) { next(err); }
});

router.patch("/:id/status", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const allowed = ["Applied", "Under Review", "Shortlisted", "Rejected", "Selected"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid application status." });
    const application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
      .populate("student", "name email").populate("job", "title company");
    if (!application) return res.status(404).json({ message: "Application not found." });
    res.json({ application });
  } catch (err) { next(err); }
});

export default router;

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  company: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  jobType: { type: String, enum: ["Full-time", "Internship", "Part-time"], default: "Full-time" },
  description: { type: String, required: true, maxlength: 5000 },
  skills: [{ type: String, trim: true }],
  eligibility: { type: String, default: "See job description" },
  deadline: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);

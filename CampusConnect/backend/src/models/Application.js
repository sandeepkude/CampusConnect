import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantName: { type: String, required: true, trim: true, maxlength: 80 },
  applicantEmail: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  department: { type: String, default: "", trim: true, maxlength: 100 },
  graduationYear: { type: Number, default: null },
  resumeFileName: { type: String, required: true },
  resumeOriginalName: { type: String, required: true },
  status: { type: String, enum: ["Applied", "Under Review", "Shortlisted", "Rejected", "Selected"], default: "Applied" },
  coverLetter: { type: String, default: "", maxlength: 2000 }
}, { timestamps: true });

applicationSchema.index({ student: 1, job: 1 }, { unique: true });
export default mongoose.model("Application", applicationSchema);

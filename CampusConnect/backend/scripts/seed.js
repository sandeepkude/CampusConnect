import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Job from "../src/models/Job.js";

await connectDB();
let admin = await User.findOne({ email: "admin@campusconnect.demo" });
if (!admin) {
  admin = await User.create({ name: "Campus Admin", email: "admin@campusconnect.demo", password: "Admin123!", role: "admin" });
  console.log("Demo admin created.");
} else {
  console.log("Demo admin already exists; leaving it unchanged.");
}
if (await Job.countDocuments() === 0) {
  await Job.insertMany([
    { title: "Graduate Software Engineer", company: "TechNova", location: "Hyderabad", jobType: "Full-time", description: "Work with a product engineering team to build and test web applications. Applicants should know programming fundamentals, OOP, data structures, and databases.", skills: ["Java", "DSA", "SQL", "Git"], eligibility: "B.Tech/B.E. graduating students", createdBy: admin._id },
    { title: "Web Development Intern", company: "BrightLabs", location: "Hybrid", jobType: "Internship", description: "Assist with responsive frontend features, API integration, and testing.", skills: ["HTML", "CSS", "JavaScript", "React"], eligibility: "Students with web development fundamentals", createdBy: admin._id },
    { title: "Backend Developer Trainee", company: "CloudBridge", location: "Bengaluru", jobType: "Full-time", description: "Develop REST APIs and work with a database under the guidance of senior developers.", skills: ["Node.js", "Express", "MongoDB", "REST APIs"], eligibility: "Freshers with backend fundamentals", createdBy: admin._id }
  ]);
  console.log("Sample jobs inserted.");
}
await mongoose.disconnect();
console.log("Seed complete.");

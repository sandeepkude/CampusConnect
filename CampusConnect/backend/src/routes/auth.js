import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function makeToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "8h" });
}
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, graduationYear: user.graduationYear };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, department = "", graduationYear = null } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Name, email, and password are required." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, password, department, graduationYear, role: "student" });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password || ""))) return res.status(401).json({ message: "Invalid email or password." });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user: publicUser(user) });
  } catch (err) { next(err); }
});

export default router;

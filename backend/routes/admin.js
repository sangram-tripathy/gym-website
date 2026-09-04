import express from "express";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import ContactMessage from "../models/ContactMessage.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", async (req, res) => {
  const [totalUsers, totalWorkouts, totalMessages] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Workout.countDocuments(),
    ContactMessage.countDocuments(),
  ]);

  const categoryStats = await Workout.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $project: { name: "$_id", count: 1, _id: 0 } },
  ]);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const workoutsByDay = await Workout.aggregate([
    { $match: { date: { $gte: new Date(last7Days[0]) } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, count: { $sum: 1 } } },
  ]);

  const dailyMap = Object.fromEntries(workoutsByDay.map((w) => [w._id, w.count]));
  const dailyWorkouts = last7Days.map((day) => ({ day: day.slice(5), count: dailyMap[day] || 0 }));

  res.json({ success: true, totalUsers, totalWorkouts, totalMessages, categoryStats, dailyWorkouts });
});

router.get("/users", async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password").sort({ joinedAt: -1 });
  res.json({ success: true, users });
});

router.get("/messages", async (req, res) => {
  const messages = await ContactMessage.find().sort({ receivedAt: -1 });
  res.json({ success: true, messages });
});

export default router;

import express from "express";
import Workout from "../models/Workout.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ success: true, workouts });
});

router.post("/", async (req, res) => {
  const { title, category, exercises, duration } = req.body;
  if (!title || !category || !exercises?.length || !duration)
    return res.status(400).json({ success: false, message: "All fields required" });
  const workout = await Workout.create({ user: req.user._id, title, category, exercises, duration });
  res.status(201).json({ success: true, workout });
});

router.delete("/:id", async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) return res.status(404).json({ success: false, message: "Workout not found" });
  await workout.deleteOne();
  res.json({ success: true, message: "Workout deleted" });
});

export default router;

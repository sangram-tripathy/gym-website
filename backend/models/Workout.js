import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 },
});

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ["Strength", "Cardio", "Flexibility", "Weight Loss", "Functional"],
    required: true,
  },
  exercises: [exerciseSchema],
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Workout", workoutSchema);

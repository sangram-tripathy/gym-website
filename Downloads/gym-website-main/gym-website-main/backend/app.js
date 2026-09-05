import express from "express";
import { config } from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { sendEmail } from "./utils/sendEmail.js";
import ContactMessage from "./models/ContactMessage.js";
import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workout.js";
import adminRoutes from "./routes/admin.js";
import aiRoutes from "./routes/ai.js";

config({ path: "./config.env" });

if (!process.env.GROQ_API_KEY) console.warn("WARNING: GROQ_API_KEY is not set. AI features will not work.");
if (!process.env.MONGO_URI) console.warn("WARNING: MONGO_URI is not set.");
if (!process.env.JWT_SECRET) console.warn("WARNING: JWT_SECRET is not set.");
if (!process.env.SMTP_MAIL) console.warn("WARNING: SMTP_MAIL is not set. Email features will not work.");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://gym-website-cnu6.vercel.app",
  "https://gym-website-n0b3m8f6n-sangram-tripathys-projects.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: "Please provide all details" });
  try {
    await sendEmail({
      email: process.env.SMTP_MAIL,
      subject: "GYM WEBSITE CONTACT",
      message,
      userEmail: email,
    });
    await ContactMessage.create({ name, email, message });
    res.status(200).json({ success: true, message: "Message Sent Successfully." });
  } catch {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

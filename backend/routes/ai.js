import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const callGroq = async (messages) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Groq API error");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
};

// ── 1. AI Workout Plan Generator ──────────────────────────────────────────────
router.post("/generate-plan", protect, async (req, res) => {
  const { goal, fitnessLevel, daysPerWeek, limitations } = req.body;
  if (!goal || !fitnessLevel || !daysPerWeek)
    return res.status(400).json({ success: false, message: "goal, fitnessLevel and daysPerWeek are required" });

  const messages = [
    {
      role: "system",
      content: "You are an expert fitness coach. Always respond with valid JSON only. No markdown, no code blocks, no explanation.",
    },
    {
      role: "user",
      content: `Generate a ${daysPerWeek}-day weekly workout plan for:
- Goal: ${goal}
- Fitness Level: ${fitnessLevel}
- Physical Limitations: ${limitations || "none"}

Return ONLY a valid JSON array with exactly ${daysPerWeek} objects:
[{ "title": "Day 1 - Push Day", "category": "Strength", "duration": 45, "exercises": [{ "name": "Bench Press", "sets": 4, "reps": 10, "weight": 0 }] }]
Categories must be one of: Strength, Cardio, Flexibility, Weight Loss, Functional.`,
    },
  ];

  try {
    const text = await callGroq(messages);
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const plan = JSON.parse(text.slice(jsonStart, jsonEnd));
    res.json({ success: true, plan });
  } catch (err) {
    console.error("generate-plan error:", err.message);
    res.status(500).json({ success: false, message: err.message || "Failed to generate plan" });
  }
});

// ── 2. AI Fitness Chatbot ─────────────────────────────────────────────────────
router.post("/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message)
    return res.status(400).json({ success: false, message: "Message is required" });

  const messages = [
    {
      role: "system",
      content: `You are a friendly fitness assistant for Intensity Fitness gym. 
You ONLY answer questions about fitness, workouts, nutrition, health, BMI, and gym-related topics.
If asked anything unrelated, politely redirect to fitness topics.
Keep answers concise and practical. Use bullet points when listing items.`,
    },
    ...(history || []).map((m) => ({ role: m.role === "model" ? "assistant" : "user", content: m.text })),
    { role: "user", content: message },
  ];

  try {
    const reply = await callGroq(messages);
    res.json({ success: true, reply });
  } catch (err) {
    console.error("chat error:", err.message);
    res.status(500).json({ success: false, message: err.message || "Failed to get response" });
  }
});

// ── 3. AI Diet Recommender ────────────────────────────────────────────────────
router.post("/diet-plan", async (req, res) => {
  const { bmi, weight, height, gender, goal } = req.body;
  if (!bmi || !weight || !height || !gender)
    return res.status(400).json({ success: false, message: "bmi, weight, height and gender are required" });

  const bmiCategory =
    bmi < 18.5 ? "Underweight" : bmi < 24.9 ? "Normal weight" : bmi < 29.9 ? "Overweight" : "Obese";

  const messages = [
    {
      role: "system",
      content: "You are a certified nutritionist. Always respond with valid JSON only. No markdown, no code blocks, no explanation.",
    },
    {
      role: "user",
      content: `Create a personalized 1-day diet plan for:
- Gender: ${gender}
- Height: ${height}cm, Weight: ${weight}kg, BMI: ${bmi} (${bmiCategory})
- Goal: ${goal || "maintain healthy weight"}

Return ONLY valid JSON in this exact format:
{
  "calories": 2200,
  "protein": "150g",
  "carbs": "220g",
  "fats": "70g",
  "meals": [
    { "meal": "Breakfast", "time": "7:00 AM", "foods": ["Oats with banana", "2 boiled eggs", "Green tea"], "calories": 450 },
    { "meal": "Mid-Morning Snack", "time": "10:00 AM", "foods": ["Apple", "Handful of almonds"], "calories": 200 },
    { "meal": "Lunch", "time": "1:00 PM", "foods": ["Brown rice", "Grilled chicken", "Salad"], "calories": 600 },
    { "meal": "Evening Snack", "time": "4:00 PM", "foods": ["Protein shake", "Banana"], "calories": 250 },
    { "meal": "Dinner", "time": "7:30 PM", "foods": ["Roti", "Dal", "Vegetables"], "calories": 500 },
    { "meal": "Post-Dinner", "time": "9:00 PM", "foods": ["Warm milk"], "calories": 200 }
  ],
  "tips": ["Drink 3-4 litres of water daily", "Avoid processed foods"]
}`,
    },
  ];

  try {
    const text = await callGroq(messages);
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const dietPlan = JSON.parse(text.slice(jsonStart, jsonEnd));
    res.json({ success: true, dietPlan });
  } catch (err) {
    console.error("diet-plan error:", err.message);
    res.status(500).json({ success: false, message: err.message || "Failed to generate diet plan" });
  }
});

export default router;

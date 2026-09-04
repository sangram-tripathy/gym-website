import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Sparkles, Utensils } from "lucide-react";
import BACKEND_URL from "../config";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [bmi, setBmi] = useState("");
  const [dietPlan, setDietPlan] = useState(null);
  const [loadingDiet, setLoadingDiet] = useState(false);

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight || !gender) {
      toast.error("Please enter valid height, weight and gender.");
      return;
    }
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);
    setDietPlan(null);

    if (bmiValue < 18.5) toast.warning("You are underweight. Consider seeking advice from a healthcare provider.");
    else if (bmiValue < 24.9) toast.success("You have normal weight. Keep maintaining a healthy lifestyle.");
    else if (bmiValue < 29.9) toast.warning("You are overweight. Consider seeking advice from a healthcare provider.");
    else toast.error("You are in the obese range. It is recommended to seek advice from a healthcare specialist.");
  };

  const getDietPlan = async () => {
    setLoadingDiet(true);
    setDietPlan(null);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/ai/diet-plan`, {
        bmi,
        weight,
        height,
        gender,
        goal: goal || "maintain healthy weight",
      });
      setDietPlan(data.dietPlan);
      toast.success("AI diet plan ready!");
    } catch {
      toast.error("Failed to generate diet plan. Try again.");
    } finally {
      setLoadingDiet(false);
    }
  };

  return (
    <section className="bmi">
      <h1>BMI CALCULATOR</h1>
      <div className="container">
        <div className="wrapper">
          <form onSubmit={calculateBMI}>
            <div>
              <label>Height (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
            </div>
            <div>
              <label>Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
            </div>
            <div>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label>Your Goal (optional)</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="">Select goal</option>
                <option value="lose weight">Lose Weight</option>
                <option value="build muscle">Build Muscle</option>
                <option value="maintain healthy weight">Maintain Weight</option>
                <option value="improve endurance">Improve Endurance</option>
              </select>
            </div>
            <button type="submit">Calculate BMI</button>
          </form>

          {bmi && (
            <div className="bmi-result">
              <p>Your BMI: <strong>{bmi}</strong></p>
              <button className="btn-ai" onClick={getDietPlan} disabled={loadingDiet}>
                <Sparkles size={16} />
                {loadingDiet ? "Generating diet plan..." : "Get AI Diet Plan"}
              </button>
            </div>
          )}
        </div>

        <div className="wrapper">
          {dietPlan ? (
            <div className="diet-plan">
              <div className="diet-macros">
                <div className="macro-card"><h4>{dietPlan.calories}</h4><p>Calories</p></div>
                <div className="macro-card"><h4>{dietPlan.protein}</h4><p>Protein</p></div>
                <div className="macro-card"><h4>{dietPlan.carbs}</h4><p>Carbs</p></div>
                <div className="macro-card"><h4>{dietPlan.fats}</h4><p>Fats</p></div>
              </div>
              <div className="diet-meals">
                {dietPlan.meals.map((meal, i) => (
                  <div className="diet-meal-card" key={i}>
                    <div className="diet-meal-header">
                      <Utensils size={14} />
                      <strong>{meal.meal}</strong>
                      <span>{meal.time}</span>
                      <span className="meal-cal">{meal.calories} kcal</span>
                    </div>
                    <ul>
                      {meal.foods.map((food, j) => <li key={j}>{food}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              {dietPlan.tips?.length > 0 && (
                <div className="diet-tips">
                  <strong>💡 Tips</strong>
                  <ul>{dietPlan.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
                </div>
              )}
            </div>
          ) : (
            <img src="/bmi.jpg" alt="bmiImage" />
          )}
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;

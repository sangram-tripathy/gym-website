import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BACKEND_URL from "../config";

const GOALS = ["Build Muscle", "Lose Weight", "Improve Endurance", "Increase Flexibility", "General Fitness"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const AIPlanGenerator = ({ onPlanSaved }) => {
  const { authHeader } = useAuth();
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [limitations, setLimitations] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [saving, setSaving] = useState(false);

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/ai/generate-plan`,
        { goal, fitnessLevel, daysPerWeek, limitations },
        { headers: authHeader() }
      );
      setPlan(data.plan);
      toast.success("AI plan generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    setSaving(true);
    try {
      await Promise.all(
        plan.map((workout) =>
          axios.post(`${BACKEND_URL}/api/workouts`, workout, { headers: authHeader() })
        )
      );
      toast.success("Full plan saved to your workout tracker!");
      setPlan(null);
      setOpen(false);
      if (onPlanSaved) onPlanSaved();
    } catch {
      toast.error("Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ai-plan-box">
      <button className="ai-plan-toggle" onClick={() => setOpen(!open)}>
        <Sparkles size={18} />
        Generate AI Workout Plan
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="ai-plan-content">
          <form onSubmit={generatePlan} className="ai-plan-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Goal</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
                  <option value="">Select goal</option>
                  {GOALS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Fitness Level</label>
                <select value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)} required>
                  <option value="">Select level</option>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Days Per Week</label>
                <select value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))}>
                  {[2, 3, 4, 5, 6].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Physical Limitations (optional)</label>
              <input value={limitations} onChange={(e) => setLimitations(e.target.value)} placeholder="e.g. bad knees, shoulder injury" />
            </div>
            <button type="submit" className="btn-ai" disabled={loading}>
              <Sparkles size={16} />
              {loading ? "Generating your plan..." : "Generate Plan"}
            </button>
          </form>

          {plan && (
            <div className="ai-plan-result">
              <h3>Your AI-Generated {daysPerWeek}-Day Plan</h3>
              <div className="ai-plan-days">
                {plan.map((day, i) => (
                  <div className="ai-day-card" key={i}>
                    <div className="ai-day-header">
                      <strong>{day.title}</strong>
                      <span className="badge">{day.category}</span>
                      <span className="duration">{day.duration} mins</span>
                    </div>
                    <table className="exercise-table">
                      <thead>
                        <tr><th>Exercise</th><th>Sets</th><th>Reps</th></tr>
                      </thead>
                      <tbody>
                        {day.exercises.map((ex, j) => (
                          <tr key={j}>
                            <td>{ex.name}</td>
                            <td>{ex.sets}</td>
                            <td>{ex.reps}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              <button className="btn-ai" onClick={savePlan} disabled={saving}>
                {saving ? "Saving..." : "Save Plan to My Workouts"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIPlanGenerator;

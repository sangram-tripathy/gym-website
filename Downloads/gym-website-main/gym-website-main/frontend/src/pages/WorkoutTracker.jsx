import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AIPlanGenerator from "../components/AIPlanGenerator";
import BACKEND_URL from "../config";

const CATEGORIES = ["Strength", "Cardio", "Flexibility", "Weight Loss", "Functional"];

const emptyExercise = { name: "", sets: "", reps: "", weight: "" };

const WorkoutTracker = () => {
  const { authHeader } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState([{ ...emptyExercise }]);
  const [loading, setLoading] = useState(false);

  const fetchWorkouts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/workouts`, { headers: authHeader() });
      setWorkouts(data.workouts);
    } catch {
      toast.error("Failed to load workouts");
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const updateExercise = (i, field, value) => {
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/workouts`,
        { title, category, duration: Number(duration), exercises: exercises.map((ex) => ({ ...ex, sets: Number(ex.sets), reps: Number(ex.reps), weight: Number(ex.weight) })) },
        { headers: authHeader() }
      );
      toast.success("Workout logged!");
      setTitle(""); setCategory(""); setDuration(""); setExercises([{ ...emptyExercise }]); setShowForm(false);
      fetchWorkouts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save workout");
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/workouts/${id}`, { headers: authHeader() });
      toast.success("Workout deleted");
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <section className="workout-tracker">
      <div className="tracker-header">
        <h1>MY WORKOUT TRACKER</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Log Workout</>}
        </button>
      </div>

      <AIPlanGenerator onPlanSaved={fetchWorkouts} />

      {showForm && (
        <form className="workout-form" onSubmit={handleSubmit}>
          <h2>New Workout</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Morning Push Day" required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Duration (mins)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min="1" required />
            </div>
          </div>

          <div className="exercises-section">
            <h3>Exercises</h3>
            {exercises.map((ex, i) => (
              <div className="exercise-row" key={i}>
                <input placeholder="Exercise name" value={ex.name} onChange={(e) => updateExercise(i, "name", e.target.value)} required />
                <input type="number" placeholder="Sets" value={ex.sets} onChange={(e) => updateExercise(i, "sets", e.target.value)} min="1" required />
                <input type="number" placeholder="Reps" value={ex.reps} onChange={(e) => updateExercise(i, "reps", e.target.value)} min="1" required />
                <input type="number" placeholder="Weight (kg)" value={ex.weight} onChange={(e) => updateExercise(i, "weight", e.target.value)} min="0" />
                {exercises.length > 1 && (
                  <button type="button" className="btn-icon" onClick={() => setExercises((prev) => prev.filter((_, idx) => idx !== i))}>
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-outline" onClick={() => setExercises((prev) => [...prev, { ...emptyExercise }])}>
              <Plus size={14} /> Add Exercise
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Workout"}
          </button>
        </form>
      )}

      <div className="workout-list">
        {workouts.length === 0 ? (
          <p className="empty-msg">No workouts logged yet. Start tracking your progress!</p>
        ) : (
          workouts.map((w) => (
            <div className="workout-card" key={w._id}>
              <div className="workout-card-header">
                <div>
                  <h3>{w.title}</h3>
                  <span className="badge">{w.category}</span>
                  <span className="duration">{w.duration} mins</span>
                </div>
                <div className="workout-card-meta">
                  <span>{new Date(w.date).toLocaleDateString()}</span>
                  <button className="btn-icon danger" onClick={() => deleteWorkout(w._id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <table className="exercise-table">
                <thead>
                  <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th></tr>
                </thead>
                <tbody>
                  {w.exercises.map((ex, i) => (
                    <tr key={i}>
                      <td>{ex.name}</td>
                      <td>{ex.sets}</td>
                      <td>{ex.reps}</td>
                      <td>{ex.weight > 0 ? `${ex.weight} kg` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default WorkoutTracker;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "../context/AuthContext";
import BACKEND_URL from "../config";

const COLORS = ["#0095ff", "#00c49f", "#ffbb28", "#ff6b6b", "#a855f7"];

const AdminDashboard = () => {
  const { authHeader } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const headers = authHeader();
    Promise.all([
      axios.get(`${BACKEND_URL}/api/admin/stats`, { headers }),
      axios.get(`${BACKEND_URL}/api/admin/users`, { headers }),
      axios.get(`${BACKEND_URL}/api/admin/messages`, { headers }),
    ])
      .then(([s, u, m]) => {
        setStats(s.data);
        setUsers(u.data.users);
        setMessages(m.data.messages);
      })
      .catch(() => toast.error("Failed to load dashboard data"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <section className="admin-dashboard">
      <h1>ADMIN DASHBOARD</h1>

      <div className="stats-cards">
        <div className="stat-card"><h2>{stats.totalUsers}</h2><p>Total Members</p></div>
        <div className="stat-card"><h2>{stats.totalWorkouts}</h2><p>Workouts Logged</p></div>
        <div className="stat-card"><h2>{stats.totalMessages}</h2><p>Contact Messages</p></div>
      </div>

      <div className="admin-tabs">
        {["overview", "members", "messages"].map((tab) => (
          <button key={tab} className={activeTab === tab ? "tab active" : "tab"} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="charts-grid">
          <div className="chart-box">
            <h3>Workouts This Week</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.dailyWorkouts}>
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="#ccc" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "none", color: "#fff" }} />
                <Bar dataKey="count" fill="#0095ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>Workout Categories</h3>
            {stats.categoryStats.length === 0 ? (
              <p className="empty-msg">No workout data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.categoryStats} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {stats.categoryStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "none", color: "#fff" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Membership</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center" }}>No members yet</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge">{u.membership}</span></td>
                    <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "messages" && (
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="empty-msg">No messages yet</p>
          ) : (
            messages.map((m) => (
              <div className="message-card" key={m._id}>
                <div className="message-header">
                  <strong>{m.name}</strong>
                  <span>{m.email}</span>
                  <span className="msg-date">{new Date(m.receivedAt).toLocaleString()}</span>
                </div>
                <p>{m.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;

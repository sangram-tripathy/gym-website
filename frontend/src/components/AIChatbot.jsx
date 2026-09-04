import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import BACKEND_URL from "../config";

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hi! I'm your Intensity Fitness AI assistant 💪 Ask me anything about workouts, nutrition, or health!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    const history = messages.slice(1);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/ai/chat`, {
        message: input,
        history,
      });
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "model", text: "Sorry, I'm having trouble connecting. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={20} />
              <span>Fitness AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role === "user" ? "user" : "bot"}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <p className="typing">Thinking<span>...</span></p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className="chatbot-input" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about workouts, diet..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default AIChatbot;

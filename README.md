# 💪 FlexGym – MERN Gym Management Platform

FlexGym is a full-stack MERN application that helps users manage their fitness journey through secure authentication, AI-powered workout recommendations, workout tracking, and email support. The application is designed with a modern, responsive interface and follows industry-standard REST API architecture.

---

## 🌐 Live Demo

🔗 https://gym-website-cnu6.vercel.app

## 💻 GitHub Repository

📂 https://github.com/sangram-tripathy/gym-website

---

## ✨ Features

- 🔐 JWT Authentication
- 🔒 Password Hashing using bcrypt
- 👤 User Registration & Login
- 🛡 Protected Routes
- 🏋 Create, View & Delete Workouts
- 🤖 AI Workout Plan Generator (Groq LLM)
- 📧 Contact Form with Email Integration (Nodemailer)
- 📱 Fully Responsive Design
- ⚡ RESTful API Architecture

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Groq LLM API
- dotenv
- CORS

---

## 📁 Project Structure

```
gym-website/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/sangram-tripathy/gym-website.git
```

```bash
cd gym-website
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
GROQ_API_KEY=your_groq_api_key
```

Start the backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

## 🔐 Authentication Flow

1. User registers an account.
2. Password is securely hashed using bcrypt.
3. User logs in with valid credentials.
4. Server generates a JWT token.
5. Token is sent to the client.
6. Protected API routes verify the token.
7. Authorized users can manage workouts and access AI features.

---

## 🤖 AI Workout Generator

Users can generate personalized workout plans based on their fitness goals using the **Groq LLM API**. The AI suggests routines tailored to the user's preferences and fitness level. :contentReference[oaicite:1]{index=1}

---

## 📧 Email Integration

The Contact page uses **Nodemailer** to send emails directly from the application, enabling users to communicate with the gym administration. :contentReference[oaicite:2]{index=2}

---

## 📡 REST API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |

### Workouts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/workouts | Get User Workouts |
| POST | /api/workouts | Create Workout |
| DELETE | /api/workouts/:id | Delete Workout |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/workout | Generate AI Workout Plan |

### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Send Contact Email |

---
## 🌐 Live Demo

🚀 **Website:** https://gym-website-cnu6.vercel.app

---

## 🚀 Future Improvements

- Workout Progress Charts
- BMI Calculator
- Nutrition Planner
- Admin Dashboard
- Exercise Video Library
- Google OAuth Login
- Push Notifications
- Payment Integration
- Dark Mode

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Added new feature"
```

4. Push your branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sangram Tripathy**

- GitHub: https://github.com/sangram-tripathy
- LinkedIn: https://www.linkedin.com/in/sangram-tripathy-8438232b0/

---

⭐ If you found this project helpful, please consider giving it a **Star** on GitHub!

# 🚀 Render Deployment Guide - Gym App

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Push your code to GitHub repository

---

## 📦 STEP 1: Push Code to GitHub

```bash
cd c:\Users\KIIT0001\Desktop\JYM-app\Gym-App-main\Gym-App-main

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Gym App"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/gym-app.git

# Push to GitHub
git push -u origin main
```

---

## 🔧 STEP 2: Deploy Backend on Render

### 2.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your **gym-app** repository

### 2.2 Configure Backend Service
Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `gym-app-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 2.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value |
|-----|-------|
| `PORT` | `4000` |
| `MONGO_URI` | `mongodb+srv://gymapp:OKWstGgY7uZsiUSD@cluster0.nulznfq.mongodb.net/gymapp?appName=Cluster0` |
| `EMAIL_USER` | `sangramtripathy5610@gmail.com` |
| `EMAIL_PASS` | `rndbmollyuyaaqgf` |
| `FRONTEND_URL` | `*` (update later with frontend URL) |

### 2.4 Deploy
- Click **"Create Web Service"**
- Wait 2-3 minutes for deployment
- Copy your backend URL: `https://gym-app-backend-xxxx.onrender.com`

---

## 🎨 STEP 3: Deploy Frontend on Render

### 3.1 Create Static Site
1. Click **"New +"** → **"Static Site"**
2. Select your **gym-app** repository

### 3.2 Configure Frontend Service
Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `gym-app-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### 3.3 Add Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://gym-app-backend-xxxx.onrender.com` (your backend URL) |

### 3.4 Deploy
- Click **"Create Static Site"**
- Wait 2-3 minutes for deployment
- Your frontend URL: `https://gym-app-frontend.onrender.com`

---

## 🔄 STEP 4: Update Backend FRONTEND_URL

1. Go to your **backend service** on Render
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` to your frontend URL: `https://gym-app-frontend.onrender.com`
4. Click **"Save Changes"** (backend will auto-redeploy)

---

## ✅ STEP 5: Test Your Deployment

1. Visit your frontend URL: `https://gym-app-frontend.onrender.com`
2. Test membership registration
3. Test contact form
4. Check MongoDB Atlas for data

---

## 🐛 Troubleshooting

### Backend Issues
- Check logs: Dashboard → Backend Service → Logs
- Verify environment variables are set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Frontend Issues
- Check build logs for errors
- Verify `VITE_API_URL` points to correct backend URL
- Clear browser cache and reload

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL
- Check backend logs for CORS-related errors

---

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Backend sleeps after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - 750 hours/month free

2. **Auto-Deploy**:
   - Push to GitHub → Render auto-deploys
   - No manual deployment needed

3. **Custom Domain** (Optional):
   - Go to Settings → Custom Domain
   - Add your domain and configure DNS

---

## 🎉 Your App is Live!

**Frontend**: `https://gym-app-frontend.onrender.com`
**Backend**: `https://gym-app-backend-xxxx.onrender.com`

Share your live app with anyone! 🚀

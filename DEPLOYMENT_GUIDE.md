# 🚀 Elite Homes - Deployment Guide

## Overview
- **Frontend**: GitHub Pages (auto-deploys from `main` branch)
- **Backend**: Render.com (Node.js + MongoDB)
- **GitHub Repo**: https://github.com/OmarKhaled2k3/Elite-Homes---Fullstack---Web-Project

---

## 📋 Prerequisites
1. **GitHub Pro** ✅ (you have this)
2. **Render Account** - Sign up at https://render.com (free tier available)
3. **MongoDB Cloud** - MongoDB Atlas (free tier available at https://www.mongodb.com/cloud/atlas)

---

## Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or log in
3. Create a new cluster (free tier M0)
4. Once created, click "Connect" and choose "Connect your application"
5. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/elitehomes`
6. **Replace `username` and `password` with your actual credentials**
7. Save this connection string for later

---

## Step 2: Push Code to GitHub

Your code is already in GitHub! Just make sure everything is up to date:

```bash
cd "E:\AAST\8th Term (2025-2026)\Web Engineering\Project\elitehomes\Elite Homes - Fullstack - Web Project"
git add .
git commit -m "Deploy: Configure for production"
git push origin main
```

---

## Step 3: Deploy Frontend to GitHub Pages

The frontend is already configured for GitHub Pages! Just run:

```bash
cd client
npm install gh-pages --save-dev
npm run deploy
```

This will:
- Build your React app
- Push the build folder to the `gh-pages` branch
- Your site will be live at: **https://omarkhaled2k3.github.io/Elite-Homes---Fullstack---Web-Project**

---

## Step 4: Deploy Backend to Render

### 4.1 Connect Your GitHub Repository

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect your GitHub account and select your repository
5. Click "Connect"

### 4.2 Configure the Render Deployment

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | elite-homes-api |
| **Environment** | Node |
| **Region** | Choose the closest to you |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Root Directory** | `server` |

### 4.3 Set Environment Variables

In the "Environment" section, add these variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/elitehomes
PORT=5000
NODE_ENV=production
```

Replace the `MONGO_URI` with your actual MongoDB Atlas connection string from Step 1.

### 4.4 Deploy

Click "Create Web Service" and wait for the deployment to complete. Once done, you'll get a URL like: `https://elite-homes-api.onrender.com`

---

## Step 5: Update Frontend with Backend URL

Once your backend is deployed on Render, update the client's API base URL:

1. Open GitHub repository settings or use GitHub Actions
2. Create a `.env.production` file in the `client` folder (optional, or set in deployment)
3. Deploy frontend again with the correct backend URL

Or, when deploying, set the environment variable:
```
REACT_APP_API_URL=https://elite-homes-api.onrender.com/api
```

---

## ✅ Final Checklist

- [ ] MongoDB Atlas is set up with a cluster
- [ ] MongoDB URI is copied and saved
- [ ] Backend code is pushed to GitHub
- [ ] Backend deployed on Render with environment variables set
- [ ] Frontend deployed to GitHub Pages
- [ ] Frontend can communicate with backend (test API calls)

---

## 🔗 Your Live URLs

Once deployed:
- **Frontend**: https://omarkhaled2k3.github.io/Elite-Homes---Fullstack---Web-Project
- **Backend API**: https://elite-homes-api.onrender.com/api
- **Health Check**: https://elite-homes-api.onrender.com/api/health

---

## 🆘 Troubleshooting

### CORS Errors
- Ensure backend CORS is configured for GitHub Pages URL
- The server is already configured to accept requests from `https://omarkhaled2k3.github.io`

### API Not Responding
- Check Render dashboard for deployment errors
- Verify MongoDB URI is correct and cluster is active
- Check that environment variables are properly set on Render

### Frontend Not Loading
- GitHub Pages takes a few minutes to deploy
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## 📞 Need Help?
- Render Support: https://render.com/support
- MongoDB Atlas Help: https://www.mongodb.com/docs/atlas
- GitHub Pages: https://docs.github.com/en/pages

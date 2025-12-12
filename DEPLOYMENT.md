# Deployment Guide: Agro Connect

This guide will walk you through deploying the Agro Connect MERN application to production.

## Prerequisites

- GitHub account
- MongoDB Atlas database (already configured)
- Gemini API key (already configured)

## Deployment Platforms

- **Backend**: Render (free tier)
- **Frontend**: Vercel (free tier)
- **Database**: MongoDB Atlas (free tier)

---

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
cd c:\Users\Pavish s\Desktop\maamey
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

2. Create a new repository on GitHub and push:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `agro-connect-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-jwt-secret>
   GEMINI_API_KEY=<your-gemini-api-key>
   FRONTEND_URL=<will-add-after-frontend-deployment>
   ```

6. Click **"Create Web Service"**
7. Wait for deployment to complete (~5 minutes)
8. Copy your backend URL (e.g., `https://agro-connect-backend.onrender.com`)

### Step 3: Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see: `{"status":"ok","service":"agro-connect-api"}`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=<your-render-backend-url>
   ```
   Example: `VITE_API_URL=https://agro-connect-backend.onrender.com`

6. Click **"Deploy"**
7. Wait for deployment (~2 minutes)
8. Copy your frontend URL (e.g., `https://agro-connect.vercel.app`)

### Step 2: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Add/Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=<your-vercel-frontend-url>
   ```
   Example: `FRONTEND_URL=https://agro-connect.vercel.app`

5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Part 3: Seed Production Database

### Option 1: Run seed script locally pointing to production

1. Temporarily update your local `.env` to use production MongoDB:
```env
MONGODB_URI=<production-mongodb-uri>
```

2. Run seed script:
```bash
cd server
npm run seed
```

3. Revert `.env` back to local MongoDB

### Option 2: Use Render Shell

1. In Render dashboard, go to your service
2. Click **"Shell"** tab
3. Run: `npm run seed`

---

## Part 4: Verification

### Test the Deployed Application

1. **Visit your frontend URL**: `https://your-app.vercel.app`

2. **Test Authentication**:
   - Sign up for a new account
   - Log in with credentials

3. **Test Products**:
   - Browse product catalog
   - Search and filter products
   - View product details

4. **Test Cart & Orders**:
   - Add items to cart
   - Create an order
   - View order history

5. **Test Chatbot** ⭐:
   - Open chatbot
   - Send message: "What products do you have?"
   - Verify AI responds correctly

6. **Test Seller Features**:
   - Login as: `seller@agroconnect.test` / `seller123`
   - Access seller dashboard
   - Create/edit products

---

## Troubleshooting

### Backend Issues

**Problem**: Backend not responding
- Check Render logs: Dashboard → Logs tab
- Verify environment variables are set correctly
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)

**Problem**: CORS errors
- Verify `FRONTEND_URL` is set correctly in Render
- Check that URL doesn't have trailing slash

### Frontend Issues

**Problem**: API calls failing
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend is running (visit `/api/health`)
- Check browser console for errors

**Problem**: Routes not working (404 on refresh)
- Verify `vercel.json` is in the `client` folder
- Redeploy if needed

### Chatbot Issues

**Problem**: Chatbot not responding
- Check Render logs for Gemini API errors
- Verify `GEMINI_API_KEY` is set correctly
- Test API key with: `node diagnose_api_key.js`

---

## Free Tier Limitations

### Render Free Tier
- ⚠️ **Auto-sleep after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free (enough for one service 24/7)

### Vercel Free Tier
- ✅ No auto-sleep
- 100 GB bandwidth/month
- Unlimited deployments

### MongoDB Atlas Free Tier
- 512 MB storage
- Shared CPU
- No auto-sleep

---

## Deployment URLs

After deployment, save these URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Health**: `https://your-backend.onrender.com/api/health`

---

## Updating the Application

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys from `main` branch

### Update Frontend
1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch

### Manual Redeploy
- **Render**: Dashboard → "Manual Deploy" → "Deploy latest commit"
- **Vercel**: Dashboard → Deployments → "Redeploy"

---

## Security Checklist

- ✅ `.env` files are in `.gitignore`
- ✅ Environment variables set in platform dashboards
- ✅ MongoDB Atlas has IP whitelist configured
- ✅ CORS is properly configured
- ✅ HTTPS enabled (automatic on Vercel/Render)
- ✅ JWT secret is strong and unique

---

## Support

If you encounter issues:
1. Check platform status pages
2. Review deployment logs
3. Verify environment variables
4. Test locally first
5. Check MongoDB Atlas connection

---

**Congratulations! Your Agro Connect application is now live! 🎉**

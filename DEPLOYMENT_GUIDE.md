# 🚀 SquadGPT Deployment Guide

This guide will help you deploy SquadGPT to the web using various platforms.

## 📋 Prerequisites

- GitHub repository with SquadGPT code
- OpenAI API key
- Account on deployment platform (Vercel, Railway, etc.)

## 🎯 **Recommended: Vercel + Railway**

### **Step 1: Deploy Backend to Railway**

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/login** with your GitHub account
3. **Click "New Project"** → "Deploy from GitHub repo"
4. **Select your SquadGPT repository**
5. **Configure the service:**
   - **Name**: `squadgpt-backend`
   - **Root Directory**: `squadgpt-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. **Add Environment Variables:**
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=production
   ```

7. **Deploy** and note the generated URL (e.g., `https://squadgpt-backend-production.up.railway.app`)

### **Step 2: Deploy Frontend to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/login** with your GitHub account
3. **Click "New Project"** → "Import Git Repository"
4. **Select your SquadGPT repository**
5. **Configure the project:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `squadgpt-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.com
   ```

7. **Deploy!** Vercel will automatically build and deploy your app

### **Step 3: Test Your Deployment**

1. **Visit your Vercel URL** (e.g., `https://squadgpt.vercel.app`)
2. **Test the app functionality**
3. **Check that AI features work** with your backend

## 🌐 **Alternative Deployment Options**

### **Option A: Full Stack on Railway**

Deploy both frontend and backend on Railway:

1. **Create two services** from the same repository
2. **Backend Service:**
   - Root Directory: `squadgpt-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: `OPENAI_API_KEY`, `PORT`, `NODE_ENV`

3. **Frontend Service:**
   - Root Directory: `squadgpt-frontend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variables: `NEXT_PUBLIC_API_URL`

### **Option B: Netlify + Railway**

**Frontend (Netlify):**
1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. Set build directory to `squadgpt-frontend`
4. Build command: `npm run build`
5. Publish directory: `squadgpt-frontend/.next`

**Backend (Railway):** Same as Step 1 above

### **Option C: Render**

**Backend:**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `squadgpt-backend`
5. Build command: `npm install`
6. Start command: `npm start`

**Frontend:**
1. Create new Static Site
2. Connect GitHub repository
3. Set root directory to `squadgpt-frontend`
4. Build command: `npm run build`
5. Publish directory: `squadgpt-frontend/.next`

## 🔧 **Environment Variables**

### **Backend (.env)**
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=production
```

### **Frontend (Environment Variables)**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 🐳 **Docker Deployment**

If you prefer Docker:

### **Backend Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### **Frontend Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Ensure backend CORS is configured for your frontend domain
   - Check environment variables are set correctly

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **API Connection Issues:**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check backend is running and accessible
   - Test API endpoints directly

4. **OpenAI API Errors:**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check API key has sufficient credits
   - Ensure API key has proper permissions

### **Debugging Steps:**

1. **Check deployment logs** in your platform's dashboard
2. **Test API endpoints** using curl or Postman
3. **Verify environment variables** are set correctly
4. **Check browser console** for frontend errors
5. **Test locally** to ensure code works before deploying

## 📊 **Monitoring & Analytics**

### **Recommended Tools:**
- **Vercel Analytics** (for frontend)
- **Railway Metrics** (for backend)
- **Sentry** (for error tracking)
- **Google Analytics** (for user analytics)

## 🔒 **Security Considerations**

1. **Environment Variables:** Never commit API keys to Git
2. **CORS:** Configure properly for production domains
3. **Rate Limiting:** Implement on backend
4. **HTTPS:** Ensure all connections use HTTPS
5. **API Keys:** Rotate regularly and use least privilege

## 🚀 **Post-Deployment**

1. **Test all features** thoroughly
2. **Set up monitoring** and error tracking
3. **Configure custom domain** (optional)
4. **Set up CI/CD** for automatic deployments
5. **Document your deployment** for team members

---

**Need help?** Check the troubleshooting section or open an issue on GitHub! 
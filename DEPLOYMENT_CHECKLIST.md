# SwiftPDF - Deployment Checklist

## Pre-Deployment Checklist

- [ ] Push all code to GitHub
- [ ] Ensure `main` or `main` branch is clean
- [ ] All environment variables are in `.env.example` files
- [ ] Backend CORS is configured to allow all localhost origins
- [ ] Frontend is using relative API paths (`/api/...`)

## Backend Deployment (Render)

### Create & Configure Service
- [ ] Create Render account (free: render.com)
- [ ] Connect GitHub repository
- [ ] Select "Web Service" deployment
- [ ] Set Build Command: `pip install -r backend/requirements.txt`
- [ ] Set Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  - `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001`
  - `PYTHON_VERSION=3.10`
- [ ] Deploy (wait ~5 minutes for build)
- [ ] **SAVE YOUR BACKEND URL** (e.g., https://swiftpdf-backend.onrender.com)

### After Backend is Live
- [ ] Test backend directly: Visit `/api/docs` on your Render URL
- [ ] Verify backend is responding

## Frontend Deployment (Vercel)

### Create & Configure Project
- [ ] Create Vercel account (free: vercel.com)
- [ ] Import GitHub repository
- [ ] Accept default Next.js settings
- [ ] Add environment variable:
  - `NEXT_PUBLIC_API_URL=[YOUR_BACKEND_URL_FROM_RENDER]`
  - Example: `https://swiftpdf-backend.onrender.com`
- [ ] Deploy (wait ~2 minutes for build)
- [ ] **SAVE YOUR FRONTEND URL** (e.g., https://swiftpdf.vercel.app)

## Link Backend & Frontend

- [ ] Go to Render dashboard
- [ ] Select your backend service
- [ ] Go to Environment Variables
- [ ] Update `ALLOWED_ORIGINS` with your Vercel URL:
  - `https://your-app-name.vercel.app`
- [ ] Click "Redeploy" to apply changes
- [ ] Wait for redeployment (~2 minutes)

## Testing

- [ ] Open your Vercel frontend URL
- [ ] Upload a test PDF file
- [ ] Test each feature:
  - [ ] Merge PDF
  - [ ] Split PDF
  - [ ] PDF to JPG conversion
  - [ ] Compression
  - [ ] Lock/Unlock
  - [ ] Watermark
- [ ] Download converted file successfully
- [ ] Check browser console for errors (F12)
- [ ] Check Render logs for backend errors

## Troubleshooting

If something doesn't work:

1. **Check Render Logs**
   - Render Dashboard → Select Backend Service → Logs
   - Look for Python errors or connection issues

2. **Check Vercel Logs**
   - Vercel Dashboard → Select Project → Deployments → Click recent deployment
   - Check build logs and runtime logs

3. **Check Browser Console**
   - Open your site in browser
   - Press F12 → Console tab
   - Look for JavaScript/network errors

4. **Test API Directly**
   - Open `https://your-backend.onrender.com/api/docs`
   - Try calling an endpoint directly from Swagger UI

5. **Verify CORS**
   - Error? Check if Render's `ALLOWED_ORIGINS` includes your Vercel domain

## Upgrade to Always-On (Optional - $12/month)

If your backend is too slow (spins down after 15 min):
1. Go to Render Dashboard → Select Backend Service
2. Click "Upgrade Plan"
3. Select "Starter - $12/month" (or higher)
4. Your backend will stay Running 24/7

## Maintenance

### Update Backend
1. Make code changes locally
2. Push to GitHub
3. Render auto-redeploys within 1 minute
4. Check Logs to ensure success

### Update Frontend
1. Make code changes locally
2. Push to GitHub
3. Vercel auto-redeploys within 1 minute
4. Check Vercel dashboard to ensure success

### Monitor Performance
- Render Dashboard → Logs (check for errors)
- Vercel Dashboard → Analytics (check performance)

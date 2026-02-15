# SwiftPDF - Deployment Guide

## Quick Deploy (5 minutes)

### Prerequisites
- GitHub account
- Render account (free: render.com)
- Vercel account (free: vercel.com)

## Deployment Steps

### 1. Backend Deployment (Render)

**Option A: Automatic (Recommended)**
1. Push code to GitHub
2. Go to [render.com/dashboard](https://render.com/dashboard)
3. Click **New +** → **Web Service**
4. Connect GitHub and select your repo
5. Configuration:
   ```
   Language: Python
   Build Command: pip install -r backend/requirements.txt
   Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   Plan: Free (or Starter for always-on)
   ```
6. Environment Variables (add these):
   ```
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   PYTHON_VERSION=3.10
   ```
7. **Deploy** - Wait for build to complete
8. Copy your backend URL from Render dashboard

### 2. Frontend Deployment (Vercel)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configuration (should auto-detect):
   ```
   Framework: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
4. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com
   ```
5. **Deploy**
6. Vercel will show your frontend URL

### 3. Link Backend & Frontend

1. Update Render environment variable:
   - Go to Render dashboard → Select backend service
   - Settings → Environment Variables
   - Set `ALLOWED_ORIGINS` to your Vercel URL: `https://your-vercel-app.vercel.app`
   - **Redeploy**

2. Vercel is already configured (uses NEXT_PUBLIC_API_URL)

## Local Development

```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

## Docker Deployment (Alternative)

```bash
# Build images
docker-compose up --build

# Production (push to registry)
docker build -t swiftpdf-backend ./backend
docker tag swiftpdf-backend YOUR_REGISTRY/swiftpdf-backend:latest
docker push YOUR_REGISTRY/swiftpdf-backend:latest
```

## Environment Variables Reference

### Backend (.env or Render config)
```
ALLOWED_ORIGINS=http://localhost:3000,https://yourapp.vercel.app  # CORS allowed domains
PYTHON_VERSION=3.10
```

### Frontend (.env.local or Vercel config)
```
NEXT_PUBLIC_API_URL=http://localhost:8000  # Local dev
NEXT_PUBLIC_API_URL=https://backend.onrender.com  # Production
```

## Costs (Free Tier)

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Render Backend | Yes | Spins down after 15 min inactivity (~50s cold start) |
| Vercel Frontend | Yes | Unlimited |
| **Total Cost** | **$0/month** | - |

**To always keep backend online**: Upgrade Render to Starter ($12/month)

## Troubleshooting

### Problem: "Failed to connect to API"
- Check browser console for the actual error
- Verify `ALLOWED_ORIGINS` in Render includes your Vercel domain
- Check Render logs for backend errors

### Problem: "PDF processing fails"
- Ensure Render backend has enough disk/memory
- Check backend logs: Render Dashboard → Logs
- May need to upgrade from Free plan

### Problem: Frontend loads but file upload fails
- Check Network tab in DevTools
- Verify API endpoint in NEXT_PUBLIC_API_URL
- Ensure CORS is properly configured in backend

## File Structure

```
SwiftPDF/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile           # Docker config
│   ├── routers/
│   │   └── pdf_routes.py    # API endpoints
│   └── utils/
│       ├── pdf_processors.py
│       └── file_utils.py
├── frontend/
│   ├── package.json         # Node dependencies
│   ├── next.config.ts       # Next.js config
│   ├── app/
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── ToolInterface.tsx
│   │   ├── FileUpload.tsx
│   │   └── ...              # Other components
│   └── Dockerfile           # Docker config
├── render.yaml              # Render deployment config
└── docker-compose.yml       # Local dev config
```

## API Endpoints

All requests go through `/api/`:

- `POST /api/process/merge` - Merge PDFs
- `POST /api/process/split` - Split PDF
- `POST /api/process/organize` - Organize pages
- `POST /api/process/compress` - Compress PDF
- `POST /api/process/pdf-to-jpg` - Convert to JPG
- `POST /api/process/jpg-to-pdf` - Convert JPG to PDF
- `POST /api/process/lock` - Lock with password
- `POST /api/process/unlock` - Unlock PDF
- `POST /api/process/watermark` - Add watermark
- `POST /api/process/preview` - Preview PDF

## Support

For issues:
1. Check Render logs: Dashboard → Logs
2. Check Vercel logs: Deployments → Logs
3. Check browser DevTools Network tab
4. Review GitHub Actions build logs

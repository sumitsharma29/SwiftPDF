# Deploy SwiftPDF on Fly.io (FREE & ALWAYS-ON)

## Why Fly.io?
- ✅ **Always-on** - No cold starts after 15 minutes (unlike Render)
- ✅ **Fast** - 5 second response time vs 50s on Render  
- ✅ **Free** - 3 shared CPU cores per month (enough for your app)
- ✅ **Docker-native** - Works with your existing Dockerfile
- ✅ **Professional** - Used by real companies

---

## Installation (5 minutes)

### Step 1: Install Fly CLI

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Verify Installation
```bash
flyctl version
```

---

## Deploy Backend (5 minutes)

```bash
cd backend

# Create Fly app for backend
flyctl launch --name swiftpdf-backend

# When prompted:
# - Would you like to copy its configuration to the new app? → YES
# - How would you like to deploy? → DOCKERFILE
# - Do you want to deploy now? → YES (wait 2-3 minutes)

# Set environment variable
flyctl secrets set ALLOWED_ORIGINS="http://localhost:3000"
# After frontend is deployed, update this with frontend URL

# View your backend URL
flyctl status
```

**You'll get something like:** `https://swiftpdf-backend.fly.dev`

---

## Deploy Frontend (5 minutes)

```bash
cd frontend

# Create Fly app for frontend  
flyctl launch --name swiftpdf-frontend

# When building fails (expected for Next.js), do this:
# Edit "fly.toml" - change to Next.js config

# OR use Vercel instead (it's optimized for Next.js)
# Just skip this step and use Vercel frontend (fastest combo)
```

---

## Option A: Fly.io for EVERYTHING (Simplest)

```bash
# Just do what I showed above for both
# Update env variables
flyctl -a swiftpdf-backend secrets set \
  ALLOWED_ORIGINS="https://swiftpdf-frontend.fly.dev"

# Done! Both services running on Fly.io
```

**Cost: $0/month** ✨

---

## Option B: Fly.io Backend + Vercel Frontend (BEST PERFORMANCE)

```bash
# Deploy backend on Fly.io (as shown above)
# Deploy frontend on Vercel (faster for Next.js)

# After Vercel deploys, update backend:
flyctl -a swiftpdf-backend secrets set \
  ALLOWED_ORIGINS="https://your-app.vercel.app"

# Redeploy
flyctl deploy -a swiftpdf-backend
```

**Cost: $0/month** ✨

---

## Useful Commands

```bash
# View logs
flyctl logs -a swiftpdf-backend

# View status
flyctl status -a swiftpdf-backend

# Redeploy
flyctl deploy -a swiftpdf-backend

# Update secrets
flyctl secrets set VAR_NAME=value -a swiftpdf-backend

# List all apps
flyctl apps list

# Delete app (if needed)
flyctl destroy -a swiftpdf-backend
```

---

## Comparison: Your Options (Ranked)

| Setup | Backend | Frontend | Free | Always-On | Speed | Setup Time |
|---|---|---|---|---|---|---|
| **Fly.io Everything** | ✅ | ✅ | $0 | ✅ | 5s | 20min |
| **Fly Backend + Vercel** | ✅ | ⚡ | $0 | ✅ | 2s | 25min |
| **Render + Vercel** | ✅ | ⚡ | $0 | ❌ | 50s | 20min |
| **Replit** | ✅ | ✅ | $0 | ✅ | 30s | 10min |

---

## Troubleshooting

### Command not found: flyctl
- Restart PowerShell/Terminal after install
- Or open new terminal window

### Build fails
- Check logs: `flyctl logs -a swiftpdf-backend`
- Make sure requirements.txt is in backend folder
- Verify Dockerfile is correct

### Backend URL shows but site doesn't load
- Wait 2-3 minutes for initial deployment
- Check logs for Python errors
- Verify ALLOWED_ORIGINS environment variable

### CORS errors
- Make sure ALLOWED_ORIGINS matches your frontend URL exactly
- Set it BEFORE deploying frontend
- Update and redeploy if frontend URL changes

---

## Keep it Running

Fly.io will keep your app running as long as you have quota. Monitor here:
https://fly.io/dashboard → Your App → Resources

---

## Next Steps

1. Install Fly CLI ✓
2. Edit `backend/Dockerfile` if needed
3. Run `flyctl launch --name swiftpdf-backend`
4. Wait for deployment
5. Copy your backend URL
6. Deploy frontend (Fly or Vercel)
7. Set ALLOWED_ORIGINS with frontend URL
8. Test! 🎉

---

**Total Deploy Time: 20 minutes**  
**Total Cost: $0/month forever** 💰

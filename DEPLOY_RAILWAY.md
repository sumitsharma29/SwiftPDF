# Deploy SwiftPDF on Railway (15 MINUTES - BEST BALANCE)

## Why Railway?
- ✅ **Simple dashboard** - Easiest web UI of all options
- ✅ **Auto-deployment from GitHub** - Push code → auto-deploys
- ✅ **Free tier is generous** - Good resource limits
- ✅ **Super fast** - 2 second response time
- ✅ **Reliable** - Professional platform used by companies
- ✅ **Email alerts** - Notified if app crashes

---

## Step 1: Create Railway Account (2 minutes)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended - auto-syncs)
3. Authorize GitHub access
4. Done!

---

## Step 2: Deploy from GitHub (3 minutes)

1. Click **"+ New Project"** (top left)
2. Select **"Deploy from GitHub Repo"**
3. Search and select **"SwiftPDF"** repo
4. Click **"Deploy Now"**
5. Wait 2-3 minutes for first build...

Railway will auto-detect:
- ✅ Python backend (from Dockerfile)
- ✅ Next.js frontend

---

## Step 3: Configure Backend Service

Once deployment completes:

1. Click on your project → **"Canvas"**
2. You'll see **"api"** service (backend)
3. Click it → **"Variables"**
4. Add environment variable:
   ```
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```
   (We'll update this after frontend is deployed)

5. Click **"Deploy"** button to apply changes

---

## Step 4: Configure Frontend Service

1. In same Canvas view, look for **"frontend"** service
2. Click it → **"Variables"**
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Click **"Deploy"**

---

## Step 5: Get Your Public URLs

Once both services are deployed:

1. In Canvas, click **"api"** service
2. Look for **"Deployments"** tab
3. Find the **public URL** (like `https://swiftpdf-production.up.railway.app`)
4. Copy this as your **BACKEND_URL**

5. Similarly, get your **FRONTEND_URL** from frontend service

---

## Step 6: Link Them Together

1. Click **"api"** service → **"Variables"**
2. Update `ALLOWED_ORIGINS = https://your-frontend-url.railway.app`
3. Click **"Deploy"**
4. Wait 1-2 minutes for redeploy...

---

## Step 7: Test Your App

1. Open your frontend URL in browser
2. Upload a test PDF
3. Try converting/processing
4. Should work instantly! ⚡

---

## How to Update Your App (Easy!)

**Every time you push to GitHub:**

```bash
# Make changes locally
git add .
git commit -m "New feature"
git push origin main
```

**Railway auto-detects and redeploys!** ✅
- No manual steps needed
- Build happens automatically
- App updates live in 2-3 minutes

---

## View Logs (Debugging)

If something breaks:

1. Go to Railway dashboard
2. Select project
3. Click service (api or frontend)
4. Click **"Deployments"**
5. Click **latest deployment**
6. Scroll down to see **logs**
7. Look for Python errors or issues

---

## Environment Variables (Complete)

### Backend (.env on Railway)
```
ALLOWED_ORIGINS=https://swiftpdf.railway.app
PYTHON_VERSION=3.10
```

### Frontend (.env on Railway)
```
NEXT_PUBLIC_API_URL=https://swiftpdf-api.railway.app
```

---

## Costs

| Feature | Cost |
|---------|------|
| Compute (backend + frontend) | Free tier (limited) |
| Storage | Free tier included |
| Bandwidth | Free tier included |
| **Total** | **$0/month** ✨ |

After free tier: Pay-as-you-go ($5-20/month for moderate usage)

---

## Comparison: Railway vs Alternatives

| Feature | Railway | Fly.io | Replit |
|---------|---------|--------|--------|
| **Setup Time** | 15 min | 20 min | 10 min |
| **CLI Needed?** | ❌ | ✅ | ❌ |
| **Free** | ✅ | ✅ | ✅ |
| **Always-On** | ✅ | ✅ | ✅ |
| **Speed** | 2s | 5s | 30s |
| **Dashboard** | Best UI | Good | Simple |
| **Auto-deploy** | ✅ | ❌ | Partial |

---

## Railway Pro Tips

### 1. Custom Domain (Optional)
```
1. Buy domain on Namecheap/GoDaddy
2. In Railway: Settings → Domain
3. Add your domain
4. Update DNS (Railway provides instructions)
```

### 2. Environment-Specific Variables
```
# Railway auto-provides:
- RAILWAY_ENVIRONMENT (production/staging)
- RAILWAY_SERVICE_NAME 
- DATABASE_URL (if you add DB)

Use in code like:
if RAILWAY_ENVIRONMENT == "production":
    # Production logic
```

### 3. Scheduled Jobs (Advanced)
```
# You can schedule Python scripts to run:
- Backup database
- Send emails
- Cleanup old files
```

### 4. Database (Paid)
```
If you need database later:
- Click "+ Add Service" 
- Select PostgreSQL
- $5/month on free tier
```

---

## Troubleshooting

### Build fails
1. Check Deployments → Logs
2. Look for Python import errors
3. Make sure requirements.txt has all packages
4. Check Dockerfile syntax

### App runs but nothing loads
- Wait 5 minutes for full initialization
- Check frontend is deployed successfully
- Verify NEXT_PUBLIC_API_URL is set correctly

### 502 Bad Gateway
- Backend service might be restarting
- Check Deployments → Service Health
- Look at logs for Python errors

### Slow performance
- Free tier has limited resources
- Try upgrading to paid tier
- Or use Fly.io instead (faster)

---

## Magic: GitHub Integration

Railway's best feature - auto-deploy on every push:

```bash
# Your workflow:
1. Code locally
2. git push origin main
3. Railway sees the push
4. Auto-builds and deploys
5. App is live!

# No manual deployments needed! ✨
```

---

## Step-by-Step Summary

```
1. railway.app → Sign up (GitHub)
2. "+ New Project" → "Deploy from GitHub"
3. Select your SwiftPDF repo
4. Wait 3 minutes for build
5. Add environment variables
6. Click "Deploy"
7. Copy your frontend URL
8. Test it!

Total time: 15 minutes
Cost: $0/month
```

---

## When to Upgrade Beyond Free

You might need to pay if:
- App gets 1000+ users per day
- PDF files are very large (10MB+)
- Running 24/7 with no downtime required
- Need database for user accounts

Cost at that point: $10-30/month

---

## Next Steps

1. **Right now:** Go to railway.app, import GitHub
2. **After it works:** Share your URL with friends
3. **Later:** Maybe add features or upgrade tier
4. **Much later:** Switch to Fly.io if you need better performance

---

## FAQ

**Q: What if I want to change code?**
A: Push to GitHub, Railway auto-deploys (2-3 min)

**Q: Can I use my domain?**
A: Yes! Add custom domain in Railway Settings

**Q: Is it really free forever?**
A: Free tier exists, but may need to pay after heavy use (~$5+)

**Q: Can I delete the app?**
A: Yes, just click "Delete" in project settings

**Q: What if Railway goes down?**
A: Unlikely - they're professional. But you can move to Fly.io anytime

---

## Railway vs My Other Recommendations

- **Easiest (Replit):** No CLI, click and run
- **Best speed (Fly.io):** Fastest response, CLI required  
- **Best balance (Railway):** Simple UI + auto-deploy + good free tier ← You are here
- **Most complex (Azure/GCP):** Most features, hard to setup

---

You're ready! 🚀 Railway is excellent for SwiftPDF!

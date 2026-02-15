# Deploy SwiftPDF on Replit (EASIEST - 10 MINUTES)

## Why Replit?
- ✅ **No CLI needed** - Just click and run
- ✅ **No credit card** - Truly free account
- ✅ **Instant deployment** - App is live in seconds
- ✅ **Built-in IDE** - Edit code in browser like VS Code
- ✅ **Perfect for beginners** - Handles everything automatically
- ✅ **Always online** - Keeps your app running 24/7

---

## Step 1: Create Replit Account (2 minutes)

1. Go to [replit.com](https://replit.com)
2. Click "Sign Up"
3. Use Google/GitHub or email
4. Verify email
5. Done!

---

## Step 2: Import Project (2 minutes)

1. From dashboard, click **"Create"** (top left)
2. Select **"Import from GitHub"**
3. Paste your GitHub repo URL:
   ```
   https://github.com/YOUR_USERNAME/SwiftPDF
   ```
4. Click **"Import"**
5. Wait 1-2 minutes for auto-detection...

Replit will automatically detect:
- ✅ Node/Next.js (frontend)
- ✅ Python/FastAPI (backend)

---

## Step 3: Configure Run Command

Once imported, Replit shows a `.replit` file. Edit it:

```bash
# Click .replit file in left panel
# Replace content with:

run = "npm --prefix frontend install && npm --prefix frontend start & python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

# This starts BOTH frontend and backend together
```

Or use the Shell tab:

```bash
# In Shell tab, run:
npm --prefix frontend install
python -m pip install -r backend/requirements.txt
npm --prefix frontend start
```

---

## Step 4: Get Your Public URL

1. Click **"Run"** button (or Ctrl+Enter)
2. Wait for startup (10-20 seconds)
3. Look for "Your app is live at:" in output
4. You'll get a URL like: `https://swiftpdf.yourusername.replit.dev`

**That's your live app!** 🎉

---

## Step 5: Update Environment Variables

Your app is already running, but to make everything work:

1. Go to **"Tools"** → **"Secrets"** (lock icon)
2. Add these variables:
   ```
   BACKEND_URL=http://localhost:8000
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ALLOWED_ORIGINS=https://swiftpdf.yourusername.replit.dev
   ```
3. Click **"Done"**
4. Click **"Run"** again to restart with env vars

---

## Step 6: Keep App Always Online (Optional)

Free Replit will pause your app after 30 minutes of no activity.

**Option A: Get Replit Boosts** (Free)
- Click on your profile
- Go to Boosts → Enable "Always On" (free tier)
- App stays online 24/7

**Option B: Use Uptime Bot**
- Use free service like [uptimerobot.com](https://uptimerobot.com)
- Send ping every 5 minutes
- App won't sleep

---

## Step 7: Test Your App

1. Open your Replit URL
2. Upload a test PDF
3. Try each feature:
   - Merge PDF
   - Split PDF
   - Compress
   - PDF to JPG
   - Etc.

**Everything works instantly!** ⚡

---

## Easy File Edits

No terminal needed! Edit directly in Replit:

```
1. Click file in left panel
2. Make changes
3. Ctrl+S to save
4. App auto-restarts
5. See changes immediately
```

---

## Deploy Updates (Easy)

**To update your live app:**

1. Make code changes
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update features"
   git push
   ```
3. Go back to Replit
4. Click **"Pull from GitHub"** (or let it auto-sync)
5. App updates automatically! ✅

---

## Comparison: Replit vs Others

| Feature | Replit | Fly.io | Render+Vercel |
|---------|--------|--------|--|
| **Setup Time** | 10 min ⚡ | 20 min | 20 min |
| **No CLI?** | ✅ | ❌ | ✅ |
| **Free** | ✅ | ✅ | ✅ |
| **Always-On** | ✅ | ✅ | ❌ |
| **Speed** | Good (30s) | Great (5s) | Slow (50s) |
| **Learning Curve** | None | Medium | Low |

---

## Costs

| Feature | Cost |
|---------|------|
| Replit Free Account | $0/month |
| Always-On Boost | Included free (or $7/mo for premium) |
| Custom Domain | Optional |
| **Total** | **$0/month** ✨ |

---

## Troubleshooting

### App won't start
- Check Shell tab for errors
- Make sure `requirements.txt` has all dependencies
- Try stopping and restarting

### Bad Gateway / 502 errors
- App might be starting (takes 10-20s)
- Wait 30 seconds and refresh
- Check Replit logs tab

### Frontend won't connect to backend
- Make sure NEXT_PUBLIC_API_URL is set correctly
- Should be `http://localhost:8000` for Replit
- Check browser console (F12) for errors

### App goes to sleep
- Enable "Always On" in Boosts (free)
- Or use uptimerobot to ping every 5 minutes

---

## Advanced: Custom Domain

Want to use your own domain (optional)?

1. Buy domain from Namecheap/GoDaddy
2. In Replit: Click "Tools" → "Secrets"
3. In domain registrar: Add DNS CNAME to your Replit URL
4. Replit auto-configures

---

## What Replit Handles For You

Replit automatically:
- ✅ Installs dependencies (npm, pip)
- ✅ Compiles code
- ✅ Manages database access  
- ✅ Scales resources
- ✅ Provides HTTPS
- ✅ Handles errors
- ✅ Provides logs

You just code! 🎉

---

## Quick Summary

**Complete deployment in 3 steps:**

1. Go to replit.com → Import GitHub
2. Click "Run"
3. Share your public URL

**That's it!** 🚀

---

## One More Time: Step-by-Step

```
1. replit.com
2. "Create" → "Import from GitHub"  
3. Paste: https://github.com/YOUR/SwiftPDF
4. Wait 2 min for auto-import
5. Setup .replit file (if needed)
6. Click "Run"
7. Copy your public URL
8. Share with friends! 🎉

Total time: 10 minutes
Cost: $0/month
```

---

## Question: Replit vs Fly vs Render?

- **Want easiest?** → **Replit** (no CLI)
- **Want best speed?** → **Fly.io** (faster response)
- **Want middle ground?** → **Render + Vercel** (simple UI)

**My pick for you?** Replit first, then upgrade to Fly.io later if needed! 

Start with Replit - you can always move later (no vendor lock-in).

---

## Next: Making It Production-Ready

Once working on Replit:
1. Maybe upgrade to `Replit Core` ($7/mo) for better performance
2. Or move to Fly.io for professional grade
3. Or keep on Replit - it's wonderful for small projects!

You're ready to go! 🚀

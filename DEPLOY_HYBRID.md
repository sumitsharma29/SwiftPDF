# Hybrid Deployment Guide: Render (Backend) + Vercel (Frontend)

This guide explains how to deploy your **SwiftPDF** application using a hybrid approach:
-   **Backend (FastAPI)**: Deployed on **Render** using Docker.
-   **Frontend (Next.js)**: Deployed on **Vercel** using standard Next.js hosting.

Both deployments will use the **SAME** GitHub repository.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to GitHub.
2.  **Render Account**: [https://render.com](https://render.com)
3.  **Vercel Account**: [https://vercel.com](https://vercel.com)

---

## Step 1: Deploy Backend to Render

1.  Log in to **Render**.
2.  Click **New +** -> **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will detect `render.yaml`.
5.  **IMPORTANT**: It will now only show `swiftpdf-backend`.
6.  Click **Apply**.
7.  Wait for the deployment to finish.
8.  **Copy the Backend URL** (e.g., `https://swiftpdf-backend-xxxx.onrender.com`).

---

## Step 2: Deploy Frontend to Netlify

1.  Log in to **Netlify**: [https://app.netlify.com](https://app.netlify.com)
2.  Click **Add new site** -> **Import from an existing project**.
3.  Connect **GitHub** and select your `SwiftPDF` repository.
4.  **Configure Site**:
    -   **Base directory**: `frontend`
    -   **Build command**: `npm run build`
    -   **Publish directory**: `.next`
    -   **Netlify will detect `netlify.toml`**: This should pre-fill most settings.
5.  **Environment Variables**:
    -   Click **Add environment variables**.
    -   Key: `NEXT_PUBLIC_API_URL`
    -   Value: `https://swiftpdf-backend-m3ap.onrender.com`
6.  Click **Deploy swiftpdf**.

---

## Step 3: Verify Connection

The `netlify.toml` file includes a rewrite rule:
-   It sends any request to `/api/*` on your frontend directly to your Render backend.
-   This avoids CORS issues and keeps your API secure.

---

## Summary of URLs

-   **Frontend**: `https://your-site-name.netlify.app`
-   **Backend**: `https://swiftpdf-backend-m3ap.onrender.com`

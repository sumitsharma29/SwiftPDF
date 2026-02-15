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

## Step 2: Deploy Frontend to Vercel

1.  Log in to **Vercel**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    -   **Root Directory**: Click `Edit` and select `frontend`.
    -   **Framework Preset**: Next.js (should be auto-detected).
    -   **Environment Variables**:
        -   Name: `NEXT_PUBLIC_API_URL`
        -   Value: `https://swiftpdf-backend-xxxx.onrender.com` (Paste the URL from Step 1).
        -   *Note*: Ensure you **REMOVE** any trailing slash `/` from the URL.
5.  Click **Deploy**.

---

## Step 3: Connect Frontend to Backend

Failed to connect? Check these common issues:

1.  **CORS**: ensure your Backend allows the Vercel Frontend URL.
    -   In Render, go to your `swiftpdf-backend` service -> **Environment**.
    -   Add/Edit `ALLOWED_ORIGINS`.
    -   Value: `https://your-vercel-project.vercel.app` (The URL Vercel gave you).
    -   Redeploy the backend if you changed this.

2.  **API Proxy**:
    -   The `vercel.json` file is configured to proxy requests from `/api/*` to your backend if you prefer to use relative paths in your code.
    -   However, setting `NEXT_PUBLIC_API_URL` is the robust way to ensure the frontend knows where to talk.

---

## Summary of URLs

-   **Frontend**: `https://your-project.vercel.app` (User visits this)
-   **Backend**: `https://swiftpdf-backend-xxxx.onrender.com` (API requests go here)

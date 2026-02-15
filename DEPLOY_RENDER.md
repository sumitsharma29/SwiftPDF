# Deploying SwiftPDF to Render (Docker)

We have configured the project to use **Docker** for both Backend (FastAPI) and Frontend (Next.js). This ensures that all system dependencies (like `poppler-utils` for PDF processing) are correctly installed and available.

## Prerequisites

-   A [Render](https://render.com) account.
-   This repository pushed to GitHub.

## Deployment Steps

1.  **Log in to Render**.
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will automatically detect the `render.yaml` file.
5.  You will see two services proposed:
    -   `swiftpdf-backend` (Docker)
    -   `swiftpdf-frontend` (Docker)
6.  Click **Apply**.

Render will now build and deploy both services. 

## Environment Variables

The `render.yaml` file automatically links the services:
-   **Frontend** gets `NEXT_PUBLIC_API_URL` pointing to the Backend.
-   **Backend** gets `ALLOWED_ORIGINS` pointing to the Frontend.

## Verification

Once deployed (status is **Live**):
1.  Open the Frontend URL (e.g., `https://swiftpdf-frontend-xxxx.onrender.com`).
2.  Try a PDF tool (e.g., Merge or Split).
3.  If it works, the connection is successful!

> [!NOTE]
> The first deployment might take a few minutes as Docker images are built. Subsequent deploys will be faster due to caching.

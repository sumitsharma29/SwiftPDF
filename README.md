# SwiftPDF (PDF Converter)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b562e50-d4fe-4a22-897c-9d8bf6873a20/deploy-status)](https://app.netlify.com/sites/swiftpdf/deploys)

**SwiftPDF** is a powerful, secure, and privacy-focused PDF manipulation tool built with **Next.js** and **FastAPI**. It offers a suite of tools to manage your PDF documents directly in your browser, with a modern, mobile-responsive interface.

![SwiftPDF Hero](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)

## 🚀 Features

### Core Tools
- **Merge PDF**: Combine multiple PDFs into a single document.
- **Split PDF**: Extract specific pages or split a PDF into multiple files.
- **Organize PDF**: Reorder, rotate, and remove pages.
- **Compress PDF**: Reduce file size while maintaining quality (powered by `pikepdf`).
- **Convert**: PDF to JPG and JPG to PDF conversion.
- **Security**: Lock (encrypt) and Unlock (decrypt) PDFs.
- **Watermark**: Add text watermarks to your documents.

### Key Highlights
- **100% Free & Private**: No files are stored permanently. All processing happens in ephemeral sessions.
- **Mobile First**: Fully responsive "App-like" experience on mobile devices with installable **PWA** support.
- **Secure**: Magic byte validation ensures only legitimate files are processed.
- **Fast**: Optimized Python backend for heavy PDF processing tasks.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Python 3.10+, FastAPI, PyPDF, Pikepdf, ReportLab
- **Infrastructure**: Vercel Serverless Functions

## 🚀 Deployment

This project is configured for seamless deployment on **Vercel**.

### Prerequisites
1.  A [Vercel](https://vercel.com) account.
2.  Verified GitHub repository.

### Steps
1.  **Fork/Clone** this repository and push to your GitHub.
2.  Import the project in Vercel.
3.  Vercel will automatically detect the **Next.js** frontend.
4.  **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: Set this to your deployed domain (e.g., `https://your-app.vercel.app`) or `/api` if using the built-in rewrites.
5.  Click **Deploy**.

The `vercel.json` and `api/index.py` files are already configured to route API requests to the Python serverless backend.

## 💻 Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sumitsharma29/SwiftPDF.git
    cd SwiftPDF
    ```

2.  **Backend Setup**:
    ```bash
    # Install dependencies
    pip install -r backend/requirements.txt
    
    # Run server
    python -m uvicorn backend.main:app --reload
    ```

3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  Open `http://localhost:3000` in your browser.

## 📄 License

This project is licensed under the MIT License.

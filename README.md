# 💠 SwiftPDF Intelligence Suite

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-05998b?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Architecting the future of document intelligence.** 
*Secure. Private. Instant.*

[Explore Tools](#-intelligence-ecosystem) • [Architecture](#-core-architecture) • [Local Setup](#-installation--deployment) • [About the Author](#-connect-with-me)

</div>

---

## ⚡ The SwiftPDF Vision

**SwiftPDF** is an ultra-premium, privacy-first document intelligence platform. Engineered with a "Cyber-Cockpit" aesthetic, it leverages a high-performance **FastAPI** backbone and a fluid **Next.js** interface to deliver elite-level PDF manipulation directly in your browser.

> [!IMPORTANT]
> **Privacy Protocol**: No files are ever stored. All processing occurs in isolated, ephemeral memory sessions. Your data remains your own.

---

## 🛠 Intelligence Ecosystem

SwiftPDF provides 16 surgical-grade tools categorized for professional workflows:

### 📄 Structural Engineering
- **Merge PDF**: Consolidate multiple documents with structural integrity.
- **Split PDF**: Deconstruct documents with surgical page extraction.
- **Organize PDF**: Architect your document flow with reordering and rotation.
- **Repair PDF**: Restore integrity to damaged or corrupted PDF sources.

### 🔐 Security & Compliance
- **Lock PDF**: Enforce military-grade AES encryption on sensitive data.
- **Unlock PDF**: Decrypt authorized documents with precision.
- **Sign PDF**: Authenticate documents with professional signature overlays.
- **Redact PDF**: Permanently obscure sensitive data with absolute certainty.

### ⚙️ Optimization & Conversion
- **Compress PDF**: Optimize storage via intelligent asset reduction.
- **PDF to JPG**: Decompose PDF pages into high-fidelity raster assets.
- **JPG to PDF**: Assemble high-resolution images into standardized PDF format.
- **Extract Text**: Harvest semantic content using advanced OCR engines.

### 📝 Metadata & Indexing
- **Edit Metadata**: Control internal document properties and indexing.
- **Page Numbers**: Implement dynamic, sequential indexing protocols.
- **Watermark PDF**: Brand documents with secure identity markers.
- **Compare PDFs**: Execute deep structural analysis between documents.

---

## 🏗 Core Architecture

SwiftPDF is built on a distributed "Vanta-Glass" architecture designed for sub-100ms UI responsiveness and heavy-duty backend processing.

- **Frontend**: `Next.js 15+` with `Turbopack`, `Framer Motion` for neural animations, and `Tailwind CSS`.
- **Backend**: `FastAPI` (Python) serving as a high-concurrency processing core.
- **PDF Engines**: `PyMuPDF`, `Pikepdf`, and `ReportLab` for pixel-perfect manipulation.
- **Security**: Magic-byte validation and isolated ephemeral processing loops.

---

## 🚀 Installation & Deployment

### 💻 Local Development Setup

1. **Clone the Intelligence Suite**
   ```bash
   git clone https://github.com/sumitsharma29/SwiftPDF.git
   cd SwiftPDF
   ```

2. **Initialize Backend Core**
   ```bash
   # Create and activate environment
   python -m venv .venv_swift
   source .venv_swift/bin/activate # or .venv_swift\Scripts\activate on Windows
   
   # Install processing kernels
   pip install -r backend/requirements.txt
   
   # Deploy local API
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload
   ```

3. **Initialize Frontend Interface**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### ☁️ Cloud Deployment

The suite is optimized for **Vercel** (Frontend) and **DigitalOcean/Render** (Backend).
- Ensure `NEXT_PUBLIC_API_URL` is configured to point to your production API endpoint.

---

## 🤝 Connect With Me

Built with ❤️ by **Sumit Sharma**. If you find this project useful, consider giving it a ⭐!

<div align="left">
  <a href="https://www.linkedin.com/in/sumit-sharma-78b93b294">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://github.com/sumitsharma29">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://www.instagram.com/sumit__sharma__29">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" />
  </a>
</div>

---

<div align="center">
  <sub>&copy; 2026 SwiftPDF Labs. All rights reserved.</sub>
</div>

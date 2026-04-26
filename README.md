# 💠 SwiftPDF Intelligence Suite

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-05998b?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Architecting the future of document intelligence.** 
*Secure. Private. Instant.*

[Explore Tools](#-intelligence-ecosystem) • [Architecture](#-core-architecture) • [Local Setup](#-installation--deployment) • [Prerequisites](#-system-prerequisites)

</div>

---

## ⚡ The SwiftPDF Vision

**SwiftPDF** is an ultra-premium, privacy-first document intelligence platform. Engineered with a "Cyber-Cockpit" aesthetic, it leverages a high-performance **FastAPI** backbone and a fluid **Next.js** interface to deliver elite-level PDF manipulation directly in your browser.

> [!IMPORTANT]
> **Privacy Protocol**: No files are ever stored. All processing occurs in isolated, ephemeral memory sessions. Your data remains your own.

---

## 🛠 Intelligence Ecosystem

SwiftPDF provides **37+ surgical-grade tools** categorized for professional workflows:

### 📄 Structural Engineering
- **Merge & Split**: Consolidate or deconstruct documents with surgical precision.
- **Organize & Rotate**: Architect document flow with reordering and orientation control.
- **Extract & Remove Pages**: Isolate specific page ranges or eliminate unwanted assets.
- **Crop & Repair**: Adjust document margins and restore corrupted sources.

### 🔐 Security & Compliance
- **Lock & Unlock**: Enforce military-grade AES encryption or decrypt authorized files.
- **Digital Signatures**: Authenticate documents with professional signature overlays.
- **Redaction & Watermarking**: Permanently obscure sensitive data or brand your documents.

### ⚙️ Optimization & Universal Conversion
- **Office Suite**: Convert between **Word**, **Excel**, **PPT**, and PDF.
- **Imagery**: Convert **JPG**, **PNG**, **PSD**, **TIFF** to PDF and vice versa.
- **Data Formats**: Transform **JSON**, **XML**, **YAML**, and **HTML** into standardized PDF reports.
- **Base64 Encoding**: Encode/Decode PDFs for secure embedding and transmission.

### 🧠 AI & Advanced Processing
- **OCR Intelligence**: Execute high-accuracy character recognition (Tesseract).
- **Background Removal**: Eliminate backgrounds using local neural processing (Rembg).
- **Comparison Engine**: Execute deep structural analysis between two documents.
- **PDF/A Archiving**: Convert documents to ISO standards for long-term preservation.

---

## 🏗 Core Architecture

SwiftPDF is built on a distributed "Vanta-Glass" architecture designed for sub-100ms UI responsiveness and heavy-duty backend processing.

- **Frontend**: `Next.js 15+` with `Turbopack`, `Framer Motion` for neural animations, and `Tailwind CSS`.
- **Backend**: `FastAPI` (Python) serving as a high-concurrency processing core.
- **PDF Engines**: `PyMuPDF`, `Pikepdf`, `Pypdf`, and `ReportLab`.
- **AI Models**: `rembg` (u2net) for background removal and `pytesseract` for OCR.

---

## 🚀 Installation & Deployment

### 💻 Local Development Setup (Windows)

1. **Clone the Suite**
   ```bash
   git clone https://github.com/sumitsharma29/SwiftPDF.git
   cd SwiftPDF
   ```

2. **Start Backend Core**
   Open a terminal in the root and run:
   ```powershell
   .\start_backend_root.bat
   ```
   *This automatically handles virtual environment creation and dependency installation.*

3. **Initialize Frontend Interface**
   Open a **second** terminal in the `frontend` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📋 System Prerequisites

To unlock the full potential of all tools, ensure the following are installed:

- **OCR PDF**: Requires [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki) installed on your system PATH.
- **Office Tools (Word/Excel/PPT)**: These tools utilize Microsoft Interop on Windows and require MS Office to be installed locally.
- **Background Removal**: Requires `onnxruntime` (`pip install onnxruntime`). The first run will download a ~170MB AI model.

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
</div>

---

<div align="center">
  <sub>&copy; 2026 SwiftPDF Labs. All rights reserved.</sub>
</div>

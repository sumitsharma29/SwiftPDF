# 💠 SwiftPDF Intelligence Suite

![SwiftPDF Cover](https://img.shields.io/badge/SwiftPDF-Pro_Suite-cyan?style=for-the-badge)

**Architecting the future of document intelligence.**
*Secure. Private. Instant.*

[Explore Tools](#-intelligence-ecosystem) • [Architecture](#-core-architecture) • [Local Setup](#-installation--deployment) • [Prerequisites](#-system-prerequisites)

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

### 🎨 Swift Editor Pro (Visual Architect)

- **Interactive Hotspots**: Click any word in a document to edit it directly—Acrobat-style.
- **Surgical Redaction**: Automatically erases original text before injecting replacements.
- **Deep-Sample Matching**: Auto-detects font size, color (RGB), and alignment (baseline).
- **HD Rendering**: High-fidelity 300DPI document preview engine for crisp editing.
- **Comparison Engine**: Execute deep structural analysis between two documents.

---

## 🏗 Core Architecture

SwiftPDF is built on a distributed "Vanta-Glass" architecture designed for sub-100ms UI responsiveness and heavy-duty backend processing.

- **Frontend**: `Next.js 15+` with `Turbopack`, `Framer Motion` for neural animations, and `Tailwind CSS`.
- **Backend**: `FastAPI` (Python) serving as a high-concurrency processing core.
- **PDF Engines**: `PyMuPDF` (Fitz), `Pikepdf`, `Pypdf`, and `ReportLab`.
- **Offline First**: Optimized for instant local performance without heavy neural weights.

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

[![LinkedIn Badge](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sumit-sharma-78b93b294)
[![GitHub Badge](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sumitsharma29)

---

© 2026 SwiftPDF Labs. All rights reserved.

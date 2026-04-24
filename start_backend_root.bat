@echo off
echo Activating Virtual Environment...
if exist .venv_swift\Scripts\activate (
    call .venv_swift\Scripts\activate
) else if exist .venv\Scripts\activate (
    call .venv\Scripts\activate
) else (
    echo Virtual environment not found. Please run: python -m venv .venv_swift
    pause
    exit /b 1
)

echo Installing/Updating dependencies...
pip install -r backend/requirements.txt

echo Starting SwiftPDF Backend on port 8001...
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8001
pause



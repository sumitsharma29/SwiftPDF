@echo off
echo Installing dependencies...
python -m pip install -r backend/requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies. Please ensure Python is installed and added to PATH.
    pause
    exit /b %errorlevel%
)

echo Starting Backend Server...
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
pause

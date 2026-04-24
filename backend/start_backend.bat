@echo off
echo Installing dependencies...
python -m pip install -r requirements.txt

echo Starting Backend Server on port 8001...
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
pause


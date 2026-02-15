import sys
import os

# Add the parent directory to the path so we can import backend
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from mangum import Mangum

# Vercel serverless handler
# The 'app' object is automatically used by Vercel's Python runtime
handler = Mangum(app)

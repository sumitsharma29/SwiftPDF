import os
import shutil
import time
import uuid
import tempfile
from typing import List

# Get system temp dir (Vercel uses /tmp)
SYSTEM_TEMP_DIR = tempfile.gettempdir()
# Create a dedicated subdirectory for our app
APP_TEMP_DIR = os.path.join(SYSTEM_TEMP_DIR, "pdf_converter_sessions")

CLEANUP_THRESHOLD_SECONDS = 1800  # 30 minutes

def ensure_app_temp_dir():
    """Ensures the application temp directory exists."""
    if not os.path.exists(APP_TEMP_DIR):
        try:
            os.makedirs(APP_TEMP_DIR, exist_ok=True)
        except Exception:
            # Fallback or pass if race condition
            pass

def generate_session_id() -> str:
    """Generates a unique session ID."""
    return str(uuid.uuid4())

def get_session_folder(session_id: str) -> str:
    """Returns the path to the session folder, creating it if it doesn't exist."""
    ensure_app_temp_dir()
    session_folder = os.path.join(APP_TEMP_DIR, session_id)
    if not os.path.exists(session_folder):
        os.makedirs(session_folder, exist_ok=True)
    return session_folder

def cleanup_old_sessions():
    """Deletes session folders older than the threshold within our app temp dir."""
    if not os.path.exists(APP_TEMP_DIR):
        return

    current_time = time.time()
    try:
        # Only list directories inside our dedicated APP_TEMP_DIR
        for item in os.listdir(APP_TEMP_DIR):
            item_path = os.path.join(APP_TEMP_DIR, item)
            if os.path.isdir(item_path):
                try:
                    # Check modification time
                    if current_time - os.path.getmtime(item_path) > CLEANUP_THRESHOLD_SECONDS:
                        shutil.rmtree(item_path)
                        print(f"Cleaned up session: {item}")
                except Exception as e:
                    print(f"Error cleaning up {item}: {e}")
    except Exception as e:
        print(f"Error accessing temp dir: {e}")

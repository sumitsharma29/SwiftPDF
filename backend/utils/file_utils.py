import os
import shutil
import time
import uuid
import tempfile
from typing import List

TEMP_DIR = tempfile.gettempdir()
CLEANUP_THRESHOLD_SECONDS = 1800  # 30 minutes

def generate_session_id() -> str:
    """Generates a unique session ID."""
    return str(uuid.uuid4())

def get_session_folder(session_id: str) -> str:
    """Returns the path to the session folder, creating it if it doesn't exist."""
    session_folder = os.path.join(TEMP_DIR, "pdf_converter", session_id)
    if not os.path.exists(session_folder):
        os.makedirs(session_folder)
    return session_folder

def cleanup_old_sessions():
    """Deletes session folders older than the threshold."""
    if not os.path.exists(TEMP_DIR):
        return

    current_time = time.time()
    for item in os.listdir(TEMP_DIR):
        item_path = os.path.join(TEMP_DIR, item)
        if os.path.isdir(item_path):
            try:
                # Check modification time
                if current_time - os.path.getmtime(item_path) > CLEANUP_THRESHOLD_SECONDS:
                    shutil.rmtree(item_path)
                    print(f"Cleaned up session: {item}")
            except Exception as e:
                print(f"Error cleaning up {item}: {e}")

from typing import List
import os
from dotenv import load_dotenv

# Load environment variables from api folder
load_dotenv(".env")

class Settings:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY", "")
        self.allowed_extensions = [".py", ".js", ".ts", ".java", ".cpp", ".c", ".cs", ".php", ".rb", ".go", ".rs"]
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        self.upload_dir = "uploads"
        self.output_dir = "outputs"

# Create directories if they don't exist
def ensure_directories():
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)

settings = Settings()
ensure_directories()

# Create directories if they don't exist
def ensure_directories():
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("outputs", exist_ok=True)

settings = Settings()
ensure_directories()

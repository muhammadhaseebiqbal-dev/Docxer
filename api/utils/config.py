from typing import List
import os
from dotenv import load_dotenv

# Load environment variables from api folder
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv()  # Also load from root directory for Vercel

class Settings:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY", "")
        self.allowed_extensions = [".py", ".js", ".ts", ".java", ".cpp", ".c", ".cs", ".php", ".rb", ".go", ".rs"]
        self.max_file_size = 10 * 1024 * 1024  # 10MB
        # Use /tmp directory for Vercel serverless functions
        self.upload_dir = "/tmp/uploads" if os.getenv("VERCEL") else "uploads"
        self.output_dir = "/tmp/outputs" if os.getenv("VERCEL") else "outputs"

# Create directories if they don't exist
def ensure_directories():
    upload_dir = "/tmp/uploads" if os.getenv("VERCEL") else "uploads"
    output_dir = "/tmp/outputs" if os.getenv("VERCEL") else "outputs"
    os.makedirs(upload_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

settings = Settings()
ensure_directories()
ensure_directories()

from fastapi import UploadFile, HTTPException
import uuid
import os
import aiofiles
from pathlib import Path
from utils.config import settings

class FileService:
    def __init__(self):
        self.allowed_extensions = settings.allowed_extensions
        self.max_file_size = settings.max_file_size
    
    def is_valid_file(self, file: UploadFile) -> bool:
        """Validate file type and size"""
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in self.allowed_extensions:
            return False
        
        # Check file size (this is approximate, real size check happens during read)
        if hasattr(file, 'size') and file.size > self.max_file_size:
            return False
            
        return True
    
    def generate_task_id(self) -> str:
        """Generate unique task ID"""
        return str(uuid.uuid4())
    
    async def read_file_content(self, file: UploadFile) -> str:
        """Read and validate file content"""
        try:
            content = await file.read()
            
            # Check actual file size
            if len(content) > self.max_file_size:
                raise HTTPException(status_code=413, detail="File too large")
            
            # Try to decode as text
            try:
                text_content = content.decode('utf-8')
            except UnicodeDecodeError:
                try:
                    text_content = content.decode('latin-1')
                except UnicodeDecodeError:
                    raise HTTPException(status_code=400, detail="Cannot read file as text")
            
            # Basic validation - should contain some code-like content
            if len(text_content.strip()) < 10:
                raise HTTPException(status_code=400, detail="File appears to be empty or too small")
            
            return text_content
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise
            raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")
    
    async def save_temp_file(self, content: str, filename: str) -> str:
        """Save content to temporary file"""
        temp_path = os.path.join(settings.upload_dir, f"{uuid.uuid4()}_{filename}")
        
        async with aiofiles.open(temp_path, 'w', encoding='utf-8') as f:
            await f.write(content)
        
        return temp_path

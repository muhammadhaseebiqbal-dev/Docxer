from pydantic import BaseModel
from typing import Optional

class ProcessingResponse(BaseModel):
    task_id: str
    status: str
    message: str

class StatusResponse(BaseModel):
    status: str  # "uploaded", "processing", "completed", "error"
    progress: int  # 0-100
    message: str
    file_path: Optional[str] = None

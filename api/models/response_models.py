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

class ProjectUploadResponse(BaseModel):
    session_id: str
    step: int  # 1 for package.json, 2 for component
    message: str
    ready_for_processing: bool = False

class ProjectSession(BaseModel):
    session_id: str
    package_json_uploaded: bool = False
    component_uploaded: bool = False
    package_json_content: Optional[str] = None
    component_content: Optional[str] = None
    component_filename: Optional[str] = None

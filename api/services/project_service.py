import json
import uuid
from typing import Dict, Optional
from fastapi import HTTPException
from models.response_models import ProjectSession

class ProjectService:
    def __init__(self):
        # In-memory storage (use Redis in production)
        self.sessions: Dict[str, ProjectSession] = {}
    
    def create_session(self) -> str:
        """Create a new project session"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = ProjectSession(session_id=session_id)
        return session_id
    
    def get_session(self, session_id: str) -> Optional[ProjectSession]:
        """Get project session by ID"""
        return self.sessions.get(session_id)
    
    def validate_package_json(self, content: str) -> dict:
        """Validate and parse package.json content"""
        try:
            package_data = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format")
        
        # Check if it's a valid package.json
        if 'name' not in package_data:
            raise HTTPException(status_code=400, detail="Missing 'name' field in package.json")
        
        # Check for React dependencies
        dependencies = package_data.get('dependencies', {})
        dev_dependencies = package_data.get('devDependencies', {})
        all_deps = {**dependencies, **dev_dependencies}
        
        react_indicators = ['react', 'react-dom', '@types/react', 'next', 'gatsby']
        has_react = any(dep in all_deps for dep in react_indicators)
        
        if not has_react:
            raise HTTPException(
                status_code=400, 
                detail="This doesn't appear to be a React project. No React dependencies found."
            )
        
        return package_data
    
    def validate_component(self, content: str, filename: str) -> bool:
        """Validate React component content"""
        # Check file extension
        valid_extensions = ['.js', '.jsx', '.ts', '.tsx']
        if not any(filename.endswith(ext) for ext in valid_extensions):
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Expected: {', '.join(valid_extensions)}"
            )
        
        # Check for React imports/usage
        react_patterns = [
            'import React',
            'from "react"',
            'from \'react\'',
            'import { ',
            'export default',
            'function ',
            'const ',
            'return ('
        ]
        
        has_react_patterns = any(pattern in content for pattern in react_patterns)
        if not has_react_patterns:
            raise HTTPException(
                status_code=400,
                detail="This doesn't appear to be a React component file"
            )
        
        return True
    
    def upload_package_json(self, session_id: str, content: str) -> ProjectSession:
        """Upload and validate package.json"""
        session = self.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate package.json
        self.validate_package_json(content)
        
        # Update session
        session.package_json_uploaded = True
        session.package_json_content = content
        
        return session
    
    def upload_component(self, session_id: str, content: str, filename: str) -> ProjectSession:
        """Upload and validate React component"""
        session = self.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate component
        self.validate_component(content, filename)
        
        # Update session
        session.component_uploaded = True
        session.component_content = content
        session.component_filename = filename
        
        return session
    
    def is_ready_for_processing(self, session_id: str) -> bool:
        """Check if session has both required files"""
        session = self.get_session(session_id)
        if not session:
            return False
        
        return session.package_json_uploaded and session.component_uploaded
    
    def cleanup_session(self, session_id: str):
        """Remove session after processing"""
        if session_id in self.sessions:
            del self.sessions[session_id]

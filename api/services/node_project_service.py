import json
import uuid
from typing import Dict, Optional, List
from fastapi import HTTPException
from models.response_models import NodeProjectSession

class NodeProjectService:
    def __init__(self):
        # In-memory storage (use Redis in production)
        self.sessions: Dict[str, NodeProjectSession] = {}
    
    def create_session(self) -> str:
        """Create a new Node.js project session"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = NodeProjectSession(session_id=session_id)
        return session_id
    
    def get_session(self, session_id: str) -> Optional[NodeProjectSession]:
        """Get Node.js project session by ID"""
        return self.sessions.get(session_id)
    
    def validate_node_package_json(self, content: str) -> dict:
        """Validate and parse package.json content for Node.js projects"""
        try:
            package_data = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON format")
        
        # Check if it's a valid package.json
        if 'name' not in package_data:
            raise HTTPException(status_code=400, detail="Missing 'name' field in package.json")
        
        # Check for Node.js/Express dependencies
        dependencies = package_data.get('dependencies', {})
        dev_dependencies = package_data.get('devDependencies', {})
        all_deps = {**dependencies, **dev_dependencies}
        
        node_indicators = ['express', 'koa', 'fastify', 'hapi', 'nestjs', 'mongoose', 'mongodb']
        has_node_backend = any(dep in all_deps for dep in node_indicators)
        
        if not has_node_backend:
            raise HTTPException(
                status_code=400, 
                detail="This doesn't appear to be a Node.js backend project. No Express, MongoDB, or other backend dependencies found."
            )
        
        return package_data
    
    def validate_server_file(self, content: str, filename: str) -> bool:
        """Validate Node.js server file content"""
        if not (filename.endswith('.js') or filename.endswith('.ts')):
            raise HTTPException(status_code=400, detail="Server file must be a JavaScript or TypeScript file")
        
        # Check for common Express patterns
        express_indicators = [
            'express()',
            'app.listen',
            'app.get',
            'app.post',
            'app.use',
            'require(\'express\')',
            'import express',
            'from \'express\''
        ]
        
        has_express = any(indicator in content for indicator in express_indicators)
        
        if not has_express:
            raise HTTPException(
                status_code=400, 
                detail="This doesn't appear to be an Express server file. No Express patterns found."
            )
        
        return True
    
    def validate_additional_file(self, content: str, filename: str) -> bool:
        """Validate additional files (routes, models, controllers, etc.)"""
        valid_extensions = ['.js', '.ts', '.json']
        
        if not any(filename.endswith(ext) for ext in valid_extensions):
            raise HTTPException(
                status_code=400, 
                detail="Additional files must be JavaScript, TypeScript, or JSON files"
            )
        
        return True
    
    def upload_package_json(self, session_id: str, content: str) -> NodeProjectSession:
        """Upload and validate package.json"""
        session = self.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate package.json
        self.validate_node_package_json(content)
        
        # Update session
        session.package_json_uploaded = True
        session.package_json_content = content
        
        return session
    
    def upload_main_server(self, session_id: str, content: str, filename: str) -> NodeProjectSession:
        """Upload and validate main server file"""
        session = self.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate server file
        self.validate_server_file(content, filename)
        
        # Update session
        session.main_server_uploaded = True
        session.main_server_content = content
        session.main_server_filename = filename
        
        return session
    
    def upload_additional_files(self, session_id: str, files: List[Dict[str, str]]) -> NodeProjectSession:
        """Upload additional files (routes, models, controllers, etc.)"""
        session = self.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate each file
        for file_data in files:
            self.validate_additional_file(file_data['content'], file_data['filename'])
        
        # Update session
        session.additional_files_uploaded = True
        session.additional_files = files
        
        return session
    
    def is_ready_for_processing(self, session_id: str) -> bool:
        """Check if session has minimum required files for processing"""
        session = self.get_session(session_id)
        if not session:
            return False
        
        # Minimum requirements: package.json and main server file
        return session.package_json_uploaded and session.main_server_uploaded
    
    def cleanup_session(self, session_id: str):
        """Remove session after processing"""
        if session_id in self.sessions:
            del self.sessions[session_id]

# Global instance
node_project_service = NodeProjectService()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ProjectApiService {
  async startProjectSession() {
    const response = await fetch(`${API_BASE_URL}/project/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to start project session');
    }

    return response.json();
  }

  async uploadPackageJson(sessionId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/project/${sessionId}/package-json`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Package.json upload failed');
    }

    return response.json();
  }

  async uploadComponent(sessionId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/project/${sessionId}/component`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Component upload failed');
    }

    return response.json();
  }

  async generateProjectDocumentation(sessionId) {
    const response = await fetch(`${API_BASE_URL}/project/${sessionId}/generate`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Documentation generation failed');
    }

    return response.json();
  }

  // Reuse existing status and download methods from main API service
  async getStatus(taskId) {
    const response = await fetch(`${API_BASE_URL}/status/${taskId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get status');
    }

    return response.json();
  }

  async downloadDocument(taskId) {
    const response = await fetch(`${API_BASE_URL}/download/${taskId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_documentation_${taskId}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async pollStatus(taskId, onUpdate) {
    const poll = async () => {
      try {
        const status = await this.getStatus(taskId);
        onUpdate(status);
        
        if (status.status === 'processing') {
          setTimeout(poll, 2000);
        }
      } catch (error) {
        onUpdate({ status: 'error', message: error.message, progress: 0 });
      }
    };
    
    poll();
  }
}

export const projectApiService = new ProjectApiService();

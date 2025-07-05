const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class NodeProjectApiService {
  async startNodeProjectSession() {
    const response = await fetch(`${API_BASE_URL}/node-project/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to start Node.js project session');
    }

    return response.json();
  }

  async uploadPackageJson(sessionId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/node-project/${sessionId}/package-json`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Package.json upload failed');
    }

    return response.json();
  }

  async uploadServerFile(sessionId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/node-project/${sessionId}/server`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Server file upload failed');
    }

    return response.json();
  }

  async uploadAdditionalFiles(sessionId, files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/node-project/${sessionId}/additional-files`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Additional files upload failed');
    }

    return response.json();
  }

  async generateNodeProjectDocumentation(sessionId) {
    const response = await fetch(`${API_BASE_URL}/node-project/${sessionId}/generate`, {
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

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `node-api-documentation_${taskId}.docx`;
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
          setTimeout(poll, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        onUpdate({ status: 'error', message: error.message, progress: 0 });
      }
    };
    
    poll();
  }
}

export const nodeProjectApiService = new NodeProjectApiService();

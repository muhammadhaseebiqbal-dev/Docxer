const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  }

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
    a.download = `documentation_${taskId}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Poll status every 2 seconds
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

export const apiService = new ApiService();

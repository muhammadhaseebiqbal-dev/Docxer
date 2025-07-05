import React, { useState } from 'react';
import { FileText, Github, Sparkles, Download, ArrowLeft } from 'lucide-react';
import UploadModeSelector from './components/UploadModeSelector';
import FileUpload from './components/FileUpload';
import ProjectUpload from './components/ProjectUpload';
import NodeProjectUpload from './components/NodeProjectUpload';
import ProcessingStatus from './components/ProcessingStatus';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { apiService } from './services/api';
import { projectApiService } from './services/projectApi';
import { nodeProjectApiService } from './services/nodeProjectApi';

const App = () => {
  const [mode, setMode] = useState(null); // 'single', 'project', or 'node-project'
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [nodeProjectData, setNodeProjectData] = useState(null);
  const [status, setStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setSelectedFile(null);
    setProjectData(null);
    setNodeProjectData(null);
    setStatus(null);
    setTaskId(null);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setStatus(null);
    setTaskId(null);
  };

  const handleProjectSelect = (data) => {
    setProjectData(data);
    setStatus(null);
    setTaskId(null);
  };

  const handleNodeProjectSelect = (data) => {
    setNodeProjectData(data);
    setStatus(null);
    setTaskId(null);
  };

  const handleSingleFileUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const response = await apiService.uploadFile(selectedFile);
      setTaskId(response.task_id);
      
      apiService.pollStatus(response.task_id, (statusUpdate) => {
        setStatus(statusUpdate);
        if (statusUpdate.status === 'completed' || statusUpdate.status === 'error') {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setStatus({
        status: 'error',
        message: error.message,
        progress: 0
      });
      setIsProcessing(false);
    }
  };

  const handleProjectUpload = async () => {
    if (!projectData) return;

    setIsProcessing(true);
    try {
      // Start project session
      const sessionResponse = await projectApiService.startProjectSession();
      const sessionId = sessionResponse.session_id;

      // Update progress
      setStatus({
        status: 'processing',
        progress: 10,
        message: 'Starting project analysis...'
      });

      // Upload package.json
      await projectApiService.uploadPackageJson(sessionId, projectData.packageJsonFile);
      
      setStatus({
        status: 'processing',
        progress: 30,
        message: 'Package.json uploaded, analyzing dependencies...'
      });

      // Upload component
      await projectApiService.uploadComponent(sessionId, projectData.componentFile);
      
      setStatus({
        status: 'processing',
        progress: 50,
        message: 'Component uploaded, generating documentation...'
      });

      // Generate documentation
      const response = await projectApiService.generateProjectDocumentation(sessionId);
      setTaskId(response.task_id);
      
      // Poll for completion
      projectApiService.pollStatus(response.task_id, (statusUpdate) => {
        setStatus(statusUpdate);
        if (statusUpdate.status === 'completed' || statusUpdate.status === 'error') {
          setIsProcessing(false);
        }
      });

    } catch (error) {
      setStatus({
        status: 'error',
        message: error.message,
        progress: 0
      });
      setIsProcessing(false);
    }
  };

  const handleNodeProjectUpload = async () => {
    if (!nodeProjectData) return;

    setIsProcessing(true);
    try {
      // Start Node project session
      const sessionResponse = await nodeProjectApiService.startNodeProjectSession();
      const sessionId = sessionResponse.session_id;

      // Update progress
      setStatus({
        status: 'processing',
        progress: 10,
        message: 'Starting Node project analysis...'
      });

      // Upload package.json
      await nodeProjectApiService.uploadPackageJson(sessionId, nodeProjectData.packageJsonFile);
      
      setStatus({
        status: 'processing',
        progress: 30,
        message: 'Package.json uploaded, analyzing dependencies...'
      });

      // Upload server file
      await nodeProjectApiService.uploadServerFile(sessionId, nodeProjectData.serverFile);
      
      setStatus({
        status: 'processing',
        progress: 50,
        message: 'Server file uploaded, generating documentation...'
      });

      // Generate documentation
      const response = await nodeProjectApiService.generateNodeProjectDocumentation(sessionId);
      setTaskId(response.task_id);
      
      // Poll for completion
      nodeProjectApiService.pollStatus(response.task_id, (statusUpdate) => {
        setStatus(statusUpdate);
        if (statusUpdate.status === 'completed' || statusUpdate.status === 'error') {
          setIsProcessing(false);
        }
      });

    } catch (error) {
      setStatus({
        status: 'error',
        message: error.message,
        progress: 0
      });
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!taskId) return;
    
    try {
      if (mode === 'single') {
        await apiService.downloadDocument(taskId);
      } else if (mode === 'project') {
        await projectApiService.downloadDocument(taskId);
      } else {
        await nodeProjectApiService.downloadDocument(taskId);
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        message: `Download failed: ${error.message}`
      }));
    }
  };

  const handleReset = () => {
    setMode(null);
    setSelectedFile(null);
    setProjectData(null);
    setNodeProjectData(null);
    setStatus(null);
    setTaskId(null);
    setIsProcessing(false);
  };

  const handleBackToMode = () => {
    setSelectedFile(null);
    setProjectData(null);
    setNodeProjectData(null);
    setStatus(null);
    setTaskId(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Docxer</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Code Documentation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {mode && !status && (
                <Button variant="outline" size="sm" onClick={handleBackToMode}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://github.com/yourusername/docxer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!mode && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">Generate Documentation Instantly</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your code files and let AI create comprehensive, professional documentation in seconds.
            </p>
          </div>
        )}

        {/* Mode Selection */}
        {!mode && (
          <UploadModeSelector onModeSelect={handleModeSelect} />
        )}

        {/* Single File Upload */}
        {mode === 'single' && !status && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Single File Documentation</h2>
              <p className="text-muted-foreground">
                Upload any code file to generate comprehensive documentation
              </p>
            </div>
            
            <FileUpload 
              onFileSelect={handleFileSelect} 
              disabled={isProcessing}
            />

            {selectedFile && (
              <div className="text-center">
                <Button 
                  onClick={handleSingleFileUpload} 
                  disabled={isProcessing}
                  size="lg"
                  className="px-8"
                >
                  {isProcessing ? 'Processing...' : 'Generate Documentation'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Project Upload */}
        {mode === 'project' && !status && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">React Project Documentation</h2>
              <p className="text-muted-foreground">
                Upload your package.json and main component for comprehensive project analysis
              </p>
            </div>
            
            <ProjectUpload 
              onProjectSelect={handleProjectSelect} 
              disabled={isProcessing}
            />

            {projectData && (
              <div className="text-center">
                <Button 
                  onClick={handleProjectUpload} 
                  disabled={isProcessing}
                  size="lg"
                  className="px-8 bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? 'Processing Project...' : 'Generate Project Documentation'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Node Project Upload */}
        {mode === 'node-project' && !status && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Node.js Project Documentation</h2>
              <p className="text-muted-foreground">
                Upload your package.json and server file for comprehensive project analysis
              </p>
            </div>
            
            <NodeProjectUpload 
              onUpload={handleNodeProjectSelect} 
              disabled={isProcessing}
            />

            {nodeProjectData && (
              <div className="text-center">
                <Button 
                  onClick={handleNodeProjectUpload} 
                  disabled={isProcessing}
                  size="lg"
                  className="px-8 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? 'Processing Node Project...' : 'Generate Node Project Documentation'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Processing Status */}
        <ProcessingStatus 
          status={status}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
        <p>Built with FastAPI, React, and Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
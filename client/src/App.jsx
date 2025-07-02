import React, { useState } from 'react';
import { FileText, Github, Sparkles, Download } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ProcessingStatus from './components/ProcessingStatus';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { apiService } from './services/api';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setStatus(null);
    setTaskId(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const response = await apiService.uploadFile(selectedFile);
      setTaskId(response.task_id);
      
      // Start polling for status
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

  const handleDownload = async () => {
    if (!taskId) return;
    
    try {
      await apiService.downloadDocument(taskId);
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        message: `Download failed: ${error.message}`
      }));
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold">Generate Documentation Instantly</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your code files and let AI create comprehensive, professional documentation in seconds.
          </p>
        </div>

        {/* Features Cards */}
        {!selectedFile && !status && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Multiple Languages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Support for Python, JavaScript, TypeScript, Java, C++, and more programming languages.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>AI-Powered</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI analyzes your code structure, functions, and logic to create detailed documentation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span>Professional Output</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get well-formatted Word documents with proper headings, code blocks, and explanations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}

        {/* File Upload */}
        <FileUpload 
          onFileSelect={handleFileSelect} 
          disabled={isProcessing}
        />

        {/* Upload Button */}
        {selectedFile && !status && (
          <div className="text-center mt-6">
            <Button 
              onClick={handleUpload} 
              disabled={isProcessing}
              size="lg"
              className="px-8"
            >
              {isProcessing ? 'Processing...' : 'Generate Documentation'}
            </Button>
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
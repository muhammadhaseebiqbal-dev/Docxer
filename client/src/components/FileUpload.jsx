import React, { useState, useCallback } from 'react';
import { Upload, FileCode, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ALLOWED_EXTENSIONS = ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const FileUpload = ({ onFileSelect, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return `File type not supported. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    return null;
  };

  const handleFileSelect = (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    onFileSelect(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          {!selectedFile ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload your code file</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Supported: {ALLOWED_EXTENSIONS.join(', ')} • Max size: 10MB
              </p>
              
              <input
                type="file"
                accept={ALLOWED_EXTENSIONS.join(',')}
                onChange={handleFileInput}
                disabled={disabled}
                className="hidden"
                id="file-input"
              />
              <Button asChild disabled={disabled}>
                <label htmlFor="file-input" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <FileCode className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;

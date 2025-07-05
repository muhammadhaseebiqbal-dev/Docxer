import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileText, Server, Plus, X } from 'lucide-react';

const NodeProjectUpload = ({ onUpload }) => {
  const [packageJsonFile, setPackageJsonFile] = useState(null);
  const [serverFile, setServerFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file, type);
    }
  };

  const handleFileSelection = (file, type) => {
    if (type === 'package') {
      if (file.name === 'package.json') {
        setPackageJsonFile(file);
      } else {
        alert('Please select a package.json file');
      }
    } else if (type === 'server') {
      if (file.name.match(/\.(js|ts)$/)) {
        setServerFile(file);
      } else {
        alert('Please select a JavaScript or TypeScript server file');
      }
    } else if (type === 'additional') {
      if (file.name.match(/\.(js|ts|json)$/)) {
        setAdditionalFiles(prev => [...prev, file]);
      } else {
        alert('Please select JavaScript, TypeScript, or JSON files');
      }
    }
  };

  const removeAdditionalFile = (index) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMultipleFileSelection = (files) => {
    const validFiles = Array.from(files).filter(file => 
      file.name.match(/\.(js|ts|json)$/)
    );
    setAdditionalFiles(prev => [...prev, ...validFiles]);
  };

  const handleUpload = () => {
    if (!packageJsonFile || !serverFile) {
      alert('Please select both package.json and server file');
      return;
    }

    onUpload({
      packageJsonFile,
      serverFile,
      additionalFiles
    });
  };

  const reset = () => {
    setPackageJsonFile(null);
    setServerFile(null);
    setAdditionalFiles([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          Node.js Express + MongoDB API Documentation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Package.json Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">1. Upload package.json</label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive && !packageJsonFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${packageJsonFile ? 'border-green-500 bg-green-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, 'package')}
            onClick={() => document.getElementById('package-json-input').click()}
          >
            <input
              id="package-json-input"
              type="file"
              accept=".json"
              onChange={(e) => handleFileSelection(e.target.files[0], 'package')}
              className="hidden"
            />
            {packageJsonFile ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <FileText className="w-5 h-5" />
                <span>{packageJsonFile.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop your package.json file
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Server File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">2. Upload Main Server File</label>
          <p className="text-xs text-gray-600">
            Upload your main server file (app.js, server.js, index.js, etc.)
          </p>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive && !serverFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${serverFile ? 'border-green-500 bg-green-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, 'server')}
            onClick={() => document.getElementById('server-input').click()}
          >
            <input
              id="server-input"
              type="file"
              accept=".js,.ts"
              onChange={(e) => handleFileSelection(e.target.files[0], 'server')}
              className="hidden"
            />
            {serverFile ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Server className="w-5 h-5" />
                <span>{serverFile.name}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop your server file (.js, .ts)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Files Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">3. Upload Additional Files (Optional)</label>
          <p className="text-xs text-gray-600">
            Upload routes, models, controllers, or other relevant files
          </p>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, 'additional')}
            onClick={() => document.getElementById('additional-input').click()}
          >
            <input
              id="additional-input"
              type="file"
              accept=".js,.ts,.json"
              multiple
              onChange={(e) => handleMultipleFileSelection(e.target.files)}
              className="hidden"
            />
            <div className="space-y-2">
              <Plus className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop additional files (.js, .ts, .json)
              </p>
            </div>
          </div>

          {/* Additional Files List */}
          {additionalFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Additional Files:</p>
              <div className="space-y-1">
                {additionalFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAdditionalFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleUpload}
            disabled={!packageJsonFile || !serverFile}
            className="flex-1"
          >
            Generate Documentation
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeProjectUpload;

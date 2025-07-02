import React, { useState } from 'react';
import { Upload, FileCode, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

const ProjectUpload = ({ onProjectSelect, disabled }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [packageJsonFile, setPackageJsonFile] = useState(null);
  const [componentFile, setComponentFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handlePackageJsonSelect = (file) => {
    if (file.name !== 'package.json') {
      setError('Please select a file named "package.json"');
      return;
    }
    setError('');
    setPackageJsonFile(file);
  };

  const handleComponentSelect = (file) => {
    const validExtensions = ['.js', '.jsx', '.ts', '.tsx'];
    const hasValidExtension = validExtensions.some(ext => file.name.endsWith(ext));
    
    if (!hasValidExtension) {
      setError(`Please select a React component file with extension: ${validExtensions.join(', ')}`);
      return;
    }
    setError('');
    setComponentFile(file);
  };

  const handleFileInputChange = (e, step) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (step === 1) {
        handlePackageJsonSelect(files[0]);
      } else {
        handleComponentSelect(files[0]);
      }
    }
  };

  const handleDrop = (e, step) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (step === 1) {
        handlePackageJsonSelect(files[0]);
      } else {
        handleComponentSelect(files[0]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (step) => {
    if (step === 1) {
      setPackageJsonFile(null);
    } else {
      setComponentFile(null);
    }
    setError('');
  };

  const handleStartProject = () => {
    onProjectSelect({ type: 'project', sessionId, packageJsonFile, componentFile });
  };

  const steps = [
    {
      number: 1,
      title: 'Upload package.json',
      description: 'Upload your React project\'s package.json file',
      icon: Package,
      file: packageJsonFile,
      isActive: currentStep === 1,
      isCompleted: packageJsonFile !== null
    },
    {
      number: 2,
      title: 'Upload Main Component',
      description: 'Upload your main React component (App.js, index.js, etc.)',
      icon: FileCode,
      file: componentFile,
      isActive: currentStep === 2,
      isCompleted: componentFile !== null
    }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span>React Project Documentation</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Upload your project files to generate comprehensive documentation
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  step.isCompleted ? "bg-green-500 border-green-500 text-white" :
                  step.isActive ? "border-primary text-primary" :
                  "border-muted text-muted-foreground"
                )}>
                  {step.isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Upload Area */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>

            {!currentStepData.file ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  disabled ? "opacity-50 cursor-not-allowed" : "border-muted-foreground/25 hover:border-primary/50"
                )}
                onDrop={(e) => handleDrop(e, currentStep)}
                onDragOver={handleDragOver}
              >
                <currentStepData.icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h4 className="text-lg font-semibold mb-2">
                  {currentStep === 1 ? 'Drop your package.json here' : 'Drop your React component here'}
                </h4>
                <p className="text-muted-foreground mb-4">
                  {currentStep === 1 ? 
                    'Must be named "package.json"' : 
                    'Supported: .js, .jsx, .ts, .tsx files'
                  }
                </p>
                
                <input
                  type="file"
                  accept={currentStep === 1 ? ".json" : ".js,.jsx,.ts,.tsx"}
                  onChange={(e) => handleFileInputChange(e, currentStep)}
                  disabled={disabled || isUploading}
                  className="hidden"
                  id={`file-input-${currentStep}`}
                />
                <Button asChild disabled={disabled || isUploading}>
                  <label htmlFor={`file-input-${currentStep}`} className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">{currentStepData.file.name}</p>
                    <p className="text-sm text-green-600">
                      {(currentStepData.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(currentStep)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Change File
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              disabled={currentStep === 1 || disabled}
            >
              Previous
            </Button>
            
            <div className="space-x-2">
              {currentStep < 2 ? (
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!currentStepData.file || disabled}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleStartProject}
                  disabled={!packageJsonFile || !componentFile || disabled}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Generate Documentation
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectUpload;

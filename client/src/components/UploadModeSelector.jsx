import React, { useState } from 'react';
import { FileText, Package, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const UploadModeSelector = ({ onModeSelect }) => {
  const [selectedMode, setSelectedMode] = useState(null);

  const modes = [
    {
      id: 'single',
      title: 'Single File Documentation',
      description: 'Upload one code file to generate documentation',
      icon: FileText,
      features: [
        'Quick and simple',
        'Perfect for individual components or scripts',
        'Instant analysis and documentation'
      ],
      buttonText: 'Upload Single File'
    },
    {
      id: 'project',
      title: 'React Project Documentation',
      description: 'Upload package.json + main component for comprehensive project docs',
      icon: Package,
      features: [
        'Complete project analysis',
        'Technology stack overview',
        'Architecture and dependency insights'
      ],
      buttonText: 'Upload Project Files'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Documentation Type</h2>
        <p className="text-muted-foreground">
          Select how you'd like to generate your documentation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modes.map((mode) => (
          <Card 
            key={mode.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg",
              selectedMode === mode.id ? "ring-2 ring-primary shadow-lg" : ""
            )}
            onClick={() => setSelectedMode(mode.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg",
                  selectedMode === mode.id ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <mode.icon className="h-5 w-5" />
                </div>
                <span>{mode.title}</span>
              </CardTitle>
              <p className="text-muted-foreground">{mode.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {mode.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={cn(
                  "w-full",
                  selectedMode === mode.id ? "bg-primary" : "bg-muted text-muted-foreground"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onModeSelect(mode.id);
                }}
                disabled={selectedMode !== mode.id}
              >
                {mode.buttonText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMode && (
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {selectedMode === 'single' ? 
              'Perfect for individual files and quick documentation' :
              'Ideal for React projects with multiple files and dependencies'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadModeSelector;

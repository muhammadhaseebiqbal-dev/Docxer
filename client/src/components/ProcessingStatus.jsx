import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProcessingStatus = ({ status, onDownload, onReset }) => {
  const getStatusIcon = () => {
    switch (status?.status) {
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status?.status) {
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = () => {
    switch (status?.status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (!status) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={getStatusColor()}>
              {status.status === 'processing' && 'Processing Document...'}
              {status.status === 'completed' && 'Documentation Ready!'}
              {status.status === 'error' && 'Processing Failed'}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{status.progress || 0}%</span>
            </div>
            <Progress 
              value={status.progress || 0} 
              className={`h-2 ${getProgressColor()}`}
            />
          </div>

          {/* Status Message */}
          <div className="text-sm text-muted-foreground">
            {status.message}
          </div>

          {/* Error Alert */}
          {status.status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {status.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Actions */}
          {status.status === 'completed' && (
            <div className="flex space-x-3 pt-4">
              <Button onClick={onDownload} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Download Document</span>
              </Button>
              
              <Button variant="outline" onClick={onReset}>
                Process Another File
              </Button>
            </div>
          )}

          {/* Error Actions */}
          {status.status === 'error' && (
            <div className="pt-4">
              <Button variant="outline" onClick={onReset}>
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingStatus;

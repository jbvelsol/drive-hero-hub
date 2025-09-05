import { useState, useCallback } from "react";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxSize?: number; // in MB
  selectedFile?: File | null;
  onFileRemove?: () => void;
}

const FileUpload = ({ 
  onFileSelect, 
  acceptedFileTypes = ".dqf,.pdf,.doc,.docx",
  maxSize = 10,
  selectedFile: externalSelectedFile,
  onFileRemove
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [internalSelectedFile, setInternalSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const selectedFile = externalSelectedFile || internalSelectedFile;

  // Reset internal state when external file is cleared
  React.useEffect(() => {
    if (!externalSelectedFile) {
      setInternalSelectedFile(null);
    }
  }, [externalSelectedFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setInternalSelectedFile(file);
    onFileSelect(file);
    toast({
      title: "File selected",
      description: `${file.name} is ready to upload`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setInternalSelectedFile(null);
    if (onFileRemove) {
      onFileRemove();
    }
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors duration-200 ${
          dragActive
            ? "border-primary bg-accent"
            : selectedFile
            ? "border-success bg-success/5"
            : "border-upload-border bg-upload-area hover:border-primary"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8">
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeFile}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  Drop your DQF file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: DQF, PDF, DOC, DOCX (max {maxSize}MB)
                </p>
              </div>
              <input
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <File className="h-4 w-4 mr-2" />
                  Choose File
                </label>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;
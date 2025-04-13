
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconUpload, IconFileUpload, IconAlertCircle } from "@tabler/icons-react";

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportCSVModal({ open, onClose }: ImportCSVModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFile(droppedFiles[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Check if file is a CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      setFile(null);
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      setFile(null);
      return;
    }
    
    setFile(file);
  };

  const handleImport = () => {
    // TODO: Implement actual import logic
    console.log("Importing file:", file);
    
    // For now, just close the modal
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Contacts from CSV</DialogTitle>
        </DialogHeader>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-gray-100 p-3">
              <IconFileUpload className="h-8 w-8 text-gray-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Drag & drop your CSV file here
              </h3>
              <p className="text-sm text-gray-500">
                or click to browse files (max 5MB)
              </p>
            </div>

            {file ? (
              <div className="bg-blue-50 border border-blue-100 rounded p-2 w-full">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors">
                <span>Browse Files</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </label>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-500">
                <IconAlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-gray-500">
            <a href="#" className="text-blue-500 hover:underline">
              Download CSV template
            </a>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file}>
              <IconUpload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

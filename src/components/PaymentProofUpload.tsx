
import React, { useState } from 'react';
import { useUploadPaymentProof } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';

interface PaymentProofUploadProps {
  paymentId: string;
  onUploadComplete?: () => void;
}

const PaymentProofUpload = ({ paymentId, onUploadComplete }: PaymentProofUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const uploadProof = useUploadPaymentProof();

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await uploadProof.mutateAsync({ paymentId, file: selectedFile });
      setSelectedFile(null);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Payment Proof
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="payment-proof-upload"
            disabled={uploadProof.isPending}
          />
          
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleUpload}
                  disabled={uploadProof.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {uploadProof.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Upload Proof
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFile(null)}
                  disabled={uploadProof.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <label htmlFor="payment-proof-upload" className="cursor-pointer">
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-lg font-medium text-gray-900">
                  Drop your payment receipt here
                </p>
                <p className="text-gray-500">
                  or click to browse files
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </label>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProofUpload;

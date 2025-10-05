'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ResumeFile {
  id: string;
  fileName: string; // Original filename for display
  storageFileName: string; // Storage filename for API operations
  studentUSN: string;
  uploadDate: string;
  fileSize: number;
  filePath: string;
  downloadUrl: string;
}

interface StudentResumeManagerProps {
  studentUSN: string;
  studentName: string;
  studentEmail: string;
}

const StudentResumeManager: React.FC<StudentResumeManagerProps> = ({ 
  studentUSN, 
  studentName, 
  studentEmail 
}) => {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    studentName: studentName,
    studentEmail: studentEmail,
    studentUSN: studentUSN
  });

  // Load resumes on component mount
  useEffect(() => {
    loadResumes();
  }, [studentUSN]);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/resumes/list');
      const data = await response.json();
      
      if (data.success) {
        // Filter resumes for this specific student
        const studentResumes = data.resumes.filter((resume: ResumeFile) => 
          resume.studentUSN.toLowerCase() === studentUSN.toLowerCase()
        );
        setResumes(studentResumes);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      setUploadStatus({ type: 'error', message: 'Please select a file' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('studentName', uploadForm.studentName);
      formData.append('studentEmail', uploadForm.studentEmail);
      formData.append('studentUSN', uploadForm.studentUSN);

      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadStatus({ type: 'success', message: 'Resume uploaded successfully!' });
        setUploadForm(prev => ({ ...prev, file: null }));
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Reload resumes
        loadResumes();
      } else {
        setUploadStatus({ type: 'error', message: data.message || 'Upload failed' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (resume: ResumeFile) => {
    try {
      // Use the download endpoint which will redirect to signed URL
      window.open(`/api/resumes/download/${resume.storageFileName}`, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      setUploadStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  const handleDelete = async (resume: ResumeFile) => {
    if (!confirm(`Are you sure you want to delete "${resume.fileName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/resumes/delete/${resume.storageFileName}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setUploadStatus({ type: 'success', message: 'Resume deleted successfully!' });
        // Reload resumes
        loadResumes();
      } else {
        setUploadStatus({ type: 'error', message: data.message || 'Failed to delete resume' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Upload Resume</h3>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Upload */}
          <div>
            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Resume File
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supported formats: PDF, DOC, DOCX (Max 5MB)
            </p>
          </div>

          {/* Upload Status */}
          {uploadStatus.type && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              uploadStatus.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{uploadStatus.message}</span>
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Resume List Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">My Resumes</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadResumes}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No resumes uploaded yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Upload your first resume using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {resume.fileName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(resume.uploadDate)} • {formatFileSize(resume.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(resume)}
                    title="Download resume"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(resume)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentResumeManager;

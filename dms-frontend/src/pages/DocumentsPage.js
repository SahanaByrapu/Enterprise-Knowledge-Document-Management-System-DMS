import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  File,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

const getFileIcon = (contentType, filename) => {
  if (contentType?.includes('pdf') || filename?.endsWith('.pdf')) return FileText;
  if (contentType?.includes('spreadsheet') || filename?.endsWith('.xlsx')) return FileSpreadsheet;
  if (contentType?.includes('presentation') || filename?.endsWith('.pptx')) return Presentation;
  return File;
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'indexed':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Indexed</Badge>;
    case 'processing':
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Processing</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    default:
      return <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100">{status}</Badge>;
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const DocumentsPage = () => {
  const { api } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async (files) => {
    if (!files?.length) return;

    const allowedExtensions = ['.pdf', '.docx', '.txt', '.xlsx', '.pptx'];
    
    for (const file of files) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        toast.error(`File type not supported: ${file.name}`);
        continue;
      }

      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      try {
        await api.post('/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        });
        toast.success(`${file.name} uploaded and indexed successfully`);
        fetchDocuments();
      } catch (error) {
        toast.error(error.response?.data?.detail || `Failed to upload ${file.name}`);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    
    try {
      await api.delete(`/documents/${docId}`);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete document');
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(Array.from(e.dataTransfer.files));
    }
  }, []);

  return (
    <div className="p-8" data-testid="documents-page">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-outfit tracking-tight text-zinc-900">Documents</h1>
            <p className="text-zinc-500 mt-1">Upload and manage your knowledge base documents</p>
          </div>
          <Button 
            onClick={fetchDocuments}
            variant="outline"
            className="gap-2"
            data-testid="refresh-docs-btn"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Upload Zone */}
        <Card className="border-2 border-dashed border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 transition-colors">
          <CardContent className="p-8">
            <div
              className={`flex flex-col items-center justify-center py-8 rounded-lg transition-all ${
                dragActive ? 'bg-blue-50 border-2 border-blue-500' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              data-testid="upload-dropzone"
            >
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                dragActive ? 'bg-blue-100' : 'bg-zinc-100'
              }`}>
                <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-600' : 'text-zinc-400'}`} />
              </div>
              
              <p className="text-lg font-medium text-zinc-700 mb-2">
                {dragActive ? 'Drop files here' : 'Drag and drop files'}
              </p>
              <p className="text-sm text-zinc-500 mb-4">or click to browse</p>
              
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.txt,.xlsx,.pptx"
                multiple
                onChange={(e) => handleUpload(Array.from(e.target.files))}
                data-testid="file-input"
              />
              <Button
                onClick={() => document.getElementById('file-upload').click()}
                disabled={uploading}
                className="bg-zinc-900 hover:bg-zinc-800"
                data-testid="upload-btn"
              >
                {uploading ? 'Uploading...' : 'Select Files'}
              </Button>
              
              <p className="text-xs text-zinc-400 mt-4">
                Supported: PDF, DOCX, TXT, XLSX, PPTX
              </p>

              {uploading && (
                <div className="w-full max-w-xs mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-zinc-500 text-center mt-1">{uploadProgress}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card data-testid="documents-list">
          <CardHeader className="border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-outfit">Uploaded Documents</CardTitle>
              <Badge variant="secondary">{documents.length} documents</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No documents yet</p>
                <p className="text-sm">Upload your first document to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {documents.map((doc, index) => {
                  const FileIcon = getFileIcon(doc.content_type, doc.filename);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`document-item-${doc.id}`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <FileIcon className="h-5 w-5 text-zinc-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 truncate">{doc.filename}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{doc.chunk_count} chunks</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploaded_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusBadge(doc.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-red-600"
                          onClick={() => handleDelete(doc.id, doc.filename)}
                          data-testid={`delete-doc-${doc.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

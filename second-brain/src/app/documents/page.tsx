'use client';

import { useEffect, useState } from 'react';
import { FileText, Search, Plus, Trash2, Edit3, File, ExternalLink } from 'lucide-react';

interface Document {
  id: number;
  title: string;
  content: string;
  file_path: string;
  file_type: string;
  metadata: string;
  created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file_path: '',
    file_type: '',
    metadata: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/documents';
      const method = editingDoc ? 'PUT' : 'POST';
      const body = editingDoc 
        ? { ...formData, id: editingDoc.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setFormData({ title: '', content: '', file_path: '', file_type: '', metadata: '' });
        setShowForm(false);
        setEditingDoc(null);
        fetchDocuments();
      }
    } catch (err) {
      console.error('Failed to save document:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      content: doc.content || '',
      file_path: doc.file_path || '',
      file_type: doc.file_type || '',
      metadata: doc.metadata || '',
    });
    setShowForm(true);
  };

  const filteredDocuments = documents.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.content && d.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getFileIcon = (fileType?: string) => {
    return <File className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            Documents
          </h1>
          <p className="text-zinc-400 mt-2">Manage your document library</p>
        </div>
        <button
          onClick={() => {
            setEditingDoc(null);
            setFormData({ title: '', content: '', file_path: '', file_type: '', metadata: '' });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Document
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingDoc ? 'Edit Document' : 'New Document'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="text"
              placeholder="File Type (e.g., PDF, DOC, TXT)"
              value={formData.file_type}
              onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="File Path / URL"
              value={formData.file_path}
              onChange={(e) => setFormData({ ...formData, file_path: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 md:col-span-2"
            />
          </div>
          <textarea
            placeholder="Content / Notes"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 mb-4"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {editingDoc ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading documents...</div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No documents found</p>
          <p className="text-zinc-600 text-sm mt-1">Start by adding your first document</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  {getFileIcon(doc.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                        {doc.file_type && (
                          <span className="px-2 py-1 bg-zinc-800 rounded text-zinc-400 uppercase text-xs">
                            {doc.file_type}
                          </span>
                        )}
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {doc.file_path && (
                        <a
                          href={doc.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {doc.content && (
                    <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                      {doc.content.length > 200 ? doc.content.slice(0, 200) + '...' : doc.content}
                    </p>
                  )}
                  {doc.file_path && (
                    <p className="text-zinc-600 text-xs mt-2 truncate">
                      Path: {doc.file_path}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

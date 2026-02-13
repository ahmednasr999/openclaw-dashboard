'use client';

import { useEffect, useState } from 'react';
import { Brain, Search, Plus, Trash2, Edit3, Tag } from 'lucide-react';

interface Memory {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    source: '',
  });

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      const data = await res.json();
      setMemories(data);
    } catch (err) {
      console.error('Failed to fetch memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/memories';
      const method = editingMemory ? 'PUT' : 'POST';
      const body = editingMemory 
        ? { ...formData, id: editingMemory.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setFormData({ title: '', content: '', category: '', tags: '', source: '' });
        setShowForm(false);
        setEditingMemory(null);
        fetchMemories();
      }
    } catch (err) {
      console.error('Failed to save memory:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    
    try {
      const res = await fetch(`/api/memories?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchMemories();
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      content: memory.content,
      category: memory.category || '',
      tags: memory.tags || '',
      source: memory.source || '',
    });
    setShowForm(true);
  };

  const filteredMemories = memories.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.tags && m.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-500" />
            Memories
          </h1>
          <p className="text-zinc-400 mt-2">Store and retrieve your important memories</p>
        </div>
        <button
          onClick={() => {
            setEditingMemory(null);
            setFormData({ title: '', content: '', category: '', tags: '', source: '' });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Memory
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingMemory ? 'Edit Memory' : 'New Memory'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 mb-4"
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              {editingMemory ? 'Update' : 'Save'}
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

      {/* Memories List */}
      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading memories...</div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No memories found</p>
          <p className="text-zinc-600 text-sm mt-1">Start by adding your first memory</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMemories.map((memory) => (
            <div key={memory.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{memory.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                    {memory.category && (
                      <span className="px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                        {memory.category}
                      </span>
                    )}
                    {memory.source && <span>Source: {memory.source}</span>}
                    <span>{new Date(memory.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(memory)}
                    className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {memory.content.length > 300 ? memory.content.slice(0, 300) + '...' : memory.content}
              </p>
              {memory.tags && (
                <div className="flex items-center gap-2 mt-4">
                  <Tag className="w-4 h-4 text-zinc-500" />
                  <div className="flex gap-2">
                    {memory.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

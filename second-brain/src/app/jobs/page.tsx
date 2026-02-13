'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Search, Plus, Trash2, Edit3, MapPin, DollarSign, Calendar, ExternalLink } from 'lucide-react';

interface Job {
  id: number;
  company: string;
  title: string;
  location: string;
  salary: string;
  status: string;
  url: string;
  notes: string;
  applied_date: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  applied: 'bg-blue-500/20 text-blue-400',
  interview: 'bg-purple-500/20 text-purple-400',
  offer: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  saved: 'bg-zinc-500/20 text-zinc-400',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    salary: '',
    status: 'applied',
    url: '',
    notes: '',
    applied_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';
      const body = editingJob 
        ? { ...formData, id: editingJob.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setFormData({
          company: '',
          title: '',
          location: '',
          salary: '',
          status: 'applied',
          url: '',
          notes: '',
          applied_date: new Date().toISOString().split('T')[0],
        });
        setShowForm(false);
        setEditingJob(null);
        fetchJobs();
      }
    } catch (err) {
      console.error('Failed to save job:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const res = await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      company: job.company,
      title: job.title,
      location: job.location || '',
      salary: job.salary || '',
      status: job.status || 'applied',
      url: job.url || '',
      notes: job.notes || '',
      applied_date: job.applied_date ? job.applied_date.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const filteredJobs = jobs.filter(j =>
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.location && j.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-green-500" />
            Job Applications
          </h1>
          <p className="text-zinc-400 mt-2">Track your job search and applications</p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setFormData({
              company: '',
              title: '',
              location: '',
              salary: '',
              status: 'applied',
              url: '',
              notes: '',
              applied_date: new Date().toISOString().split('T')[0],
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search jobs by company, title, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingJob ? 'Edit Job' : 'New Job Application'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Company *"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="text"
              placeholder="Job Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Salary Range"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="date"
              value={formData.applied_date}
              onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
            <input
              type="url"
              placeholder="Job URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 md:col-span-2"
            />
          </div>
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 mb-4"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              {editingJob ? 'Update' : 'Save'}
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

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No jobs found</p>
          <p className="text-zinc-600 text-sm mt-1">Start tracking your job applications</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Briefcase className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <p className="text-zinc-400">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[job.status] || statusColors.saved}`}>
                            {job.status}
                          </span>
                          {job.url && (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-zinc-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(job)}
                            className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                        )}
                        {job.applied_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied: {new Date(job.applied_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {job.notes && (
                        <p className="text-zinc-400 text-sm mt-3 bg-zinc-950 p-3 rounded-lg">
                          {job.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

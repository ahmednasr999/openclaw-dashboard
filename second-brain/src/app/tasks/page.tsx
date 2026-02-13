'use client';

import { useEffect, useState } from 'react';
import { CheckSquare, Search, Plus, Trash2, Edit3, Calendar, Flag, Folder } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const priorityColors: Record<string, string> = {
  low: 'bg-zinc-500/20 text-zinc-400',
  medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-red-500/20 text-red-400',
};

const statusColors: Record<string, string> = {
  pending: 'bg-zinc-500/20 text-zinc-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    category: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      const body = editingTask 
        ? { ...formData, id: editingTask.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          due_date: '',
          category: '',
        });
        setShowForm(false);
        setEditingTask(null);
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
      category: task.category || '',
    });
    setShowForm(true);
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-amber-500" />
            Tasks
          </h1>
          <p className="text-zinc-400 mt-2">Manage your tasks and to-dos</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setFormData({
              title: '',
              description: '',
              status: 'pending',
              priority: 'medium',
              due_date: '',
              category: '',
            });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-zinc-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-zinc-500 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{inProgressCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-zinc-500 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-400">{completedCount}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingTask ? 'Edit Task' : 'New Task'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Task Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              placeholder="Due Date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-amber-500 md:col-span-2"
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 mb-4"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
            >
              {editingTask ? 'Update' : 'Save'}
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

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No tasks found</p>
          <p className="text-zinc-600 text-sm mt-1">Start by adding your first task</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-zinc-900 border rounded-xl p-4 transition-colors ${
                task.status === 'completed' ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStatus(task)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-500'
                      : 'border-zinc-600 hover:border-amber-500'
                  }`}
                >
                  {task.status === 'completed' && <CheckSquare className="w-3 h-3 text-white" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${task.status === 'completed' ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${priorityColors[task.priority] || priorityColors.medium}`}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[task.status] || statusColors.pending}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        {task.category && (
                          <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                            <Folder className="w-3 h-3 inline mr-1" />
                            {task.category}
                          </span>
                        )}
                        {task.due_date && (
                          <span className={`text-xs flex items-center gap-1 ${
                            new Date(task.due_date) < new Date() && task.status !== 'completed'
                              ? 'text-red-400'
                              : 'text-zinc-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className={`text-sm mt-2 ${task.status === 'completed' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

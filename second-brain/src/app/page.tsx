'use client';

import { useEffect, useState } from 'react';
import { 
  Brain, 
  FileText, 
  Briefcase, 
  CheckSquare,
  TrendingUp 
} from 'lucide-react';

interface DashboardStats {
  counts: {
    memories: number;
    documents: number;
    activeJobs: number;
    pendingTasks: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    { 
      title: 'Memories', 
      value: stats?.counts.memories || 0, 
      icon: Brain, 
      color: 'bg-purple-500/20 text-purple-400',
      href: '/memories'
    },
    { 
      title: 'Documents', 
      value: stats?.counts.documents || 0, 
      icon: FileText, 
      color: 'bg-blue-500/20 text-blue-400',
      href: '/documents'
    },
    { 
      title: 'Active Jobs', 
      value: stats?.counts.activeJobs || 0, 
      icon: Briefcase, 
      color: 'bg-green-500/20 text-green-400',
      href: '/jobs'
    },
    { 
      title: 'Pending Tasks', 
      value: stats?.counts.pendingTasks || 0, 
      icon: CheckSquare, 
      color: 'bg-amber-500/20 text-amber-400',
      href: '/tasks'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Welcome back to your 2nd Brain</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.href}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {loading ? '-' : card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/memories"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Memory
          </a>
          <a
            href="/documents"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Document
          </a>
          <a
            href="/jobs"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Job
          </a>
          <a
            href="/tasks"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Task
          </a>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          What is 2nd Brain?
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Your 2nd Brain is a personal knowledge management system that helps you capture, 
          organize, and retrieve information. It integrates your memories, documents, 
          job applications, and tasks in one unified interface. Start by exploring 
          the different sections from the sidebar or use the quick actions above.
        </p>
      </div>
    </div>
  );
}

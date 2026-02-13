'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Brain, 
  FileText, 
  Briefcase, 
  CheckSquare 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/memories', label: 'Memories', icon: Brain },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          2nd Brain
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Ahmed's Knowledge Hub</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-600">
          <p>© 2026 Second Brain</p>
          <p>Built with Next.js + SQLite</p>
        </div>
      </div>
    </aside>
  );
}

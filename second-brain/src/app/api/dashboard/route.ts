import { NextResponse } from 'next/server';
import { openDb, get } from '@/lib/database';

export async function GET() {
  const db = await openDb();
  try {
    const memoriesCount = await get(db, 'SELECT COUNT(*) as count FROM memories');
    const documentsCount = await get(db, 'SELECT COUNT(*) as count FROM documents');
    const activeJobsCount = await get(db, 'SELECT COUNT(*) as count FROM jobs WHERE status IN (\"applied\", \"interview\", \"offer\")');
    const pendingTasksCount = await get(db, 'SELECT COUNT(*) as count FROM tasks WHERE status = \"pending\"');
    
    // Recent items
    const recentMemories = await get(db, 'SELECT * FROM memories ORDER BY created_at DESC LIMIT 5');
    const recentTasks = await get(db, 'SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5');

    return NextResponse.json({
      counts: {
        memories: memoriesCount?.count || 0,
        documents: documentsCount?.count || 0,
        activeJobs: activeJobsCount?.count || 0,
        pendingTasks: pendingTasksCount?.count || 0,
      },
      recent: {
        memories: recentMemories ? [recentMemories] : [],
        tasks: recentTasks ? [recentTasks] : [],
      }
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  } finally {
    db.close();
  }
}

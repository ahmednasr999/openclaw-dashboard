import { NextRequest, NextResponse } from 'next/server';
import { openDb, all, run } from '@/lib/database';

export async function GET() {
  const db = await openDb();
  try {
    const tasks = await all(db, 'SELECT * FROM tasks ORDER BY created_at DESC');
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Tasks API error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function POST(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { title, description, status, priority, due_date, category } = body;

    const result = await run(
      db,
      'INSERT INTO tasks (title, description, status, priority, due_date, category) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, status, priority, due_date, category]
    );

    return NextResponse.json({ id: result.lastID, ...body }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function PUT(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { id, title, description, status, priority, due_date, category } = body;

    await run(
      db,
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, status, priority, due_date, category, id]
    );

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function DELETE(request: NextRequest) {
  const db = await openDb();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await run(db, 'DELETE FROM tasks WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  } finally {
    db.close();
  }
}

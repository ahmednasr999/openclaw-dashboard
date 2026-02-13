import { NextRequest, NextResponse } from 'next/server';
import { openDb, all, run, get } from '@/lib/database';

export async function GET() {
  const db = await openDb();
  try {
    const memories = await all(db, 'SELECT * FROM memories ORDER BY created_at DESC');
    return NextResponse.json(memories);
  } catch (error) {
    console.error('Memories API error:', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function POST(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { title, content, category, tags, source } = body;

    const result = await run(
      db,
      'INSERT INTO memories (title, content, category, tags, source) VALUES (?, ?, ?, ?, ?)',
      [title, content, category, tags, source]
    );

    return NextResponse.json({ id: result.lastID, ...body }, { status: 201 });
  } catch (error) {
    console.error('Create memory error:', error);
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function PUT(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { id, title, content, category, tags, source } = body;

    await run(
      db,
      'UPDATE memories SET title = ?, content = ?, category = ?, tags = ?, source = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, category, tags, source, id]
    );

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Update memory error:', error);
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
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

    await run(db, 'DELETE FROM memories WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete memory error:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  } finally {
    db.close();
  }
}

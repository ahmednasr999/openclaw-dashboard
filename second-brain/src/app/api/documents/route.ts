import { NextRequest, NextResponse } from 'next/server';
import { openDb, all, run } from '@/lib/database';

export async function GET() {
  const db = await openDb();
  try {
    const documents = await all(db, 'SELECT * FROM documents ORDER BY created_at DESC');
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function POST(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { title, content, file_path, file_type, metadata } = body;

    const result = await run(
      db,
      'INSERT INTO documents (title, content, file_path, file_type, metadata) VALUES (?, ?, ?, ?, ?)',
      [title, content, file_path, file_type, metadata]
    );

    return NextResponse.json({ id: result.lastID, ...body }, { status: 201 });
  } catch (error) {
    console.error('Create document error:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function PUT(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { id, title, content, file_path, file_type, metadata } = body;

    await run(
      db,
      'UPDATE documents SET title = ?, content = ?, file_path = ?, file_type = ?, metadata = ? WHERE id = ?',
      [title, content, file_path, file_type, metadata, id]
    );

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
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

    await run(db, 'DELETE FROM documents WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  } finally {
    db.close();
  }
}

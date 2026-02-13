import { NextRequest, NextResponse } from 'next/server';
import { openDb, all, run, get } from '@/lib/database';

export async function GET() {
  const db = await openDb();
  try {
    const jobs = await all(db, 'SELECT * FROM jobs ORDER BY created_at DESC');
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Jobs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function POST(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { company, title, location, salary, status, url, notes, applied_date } = body;

    const result = await run(
      db,
      'INSERT INTO jobs (company, title, location, salary, status, url, notes, applied_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [company, title, location, salary, status, url, notes, applied_date]
    );

    return NextResponse.json({ id: result.lastID, ...body }, { status: 201 });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function PUT(request: NextRequest) {
  const db = await openDb();
  try {
    const body = await request.json();
    const { id, company, title, location, salary, status, url, notes, applied_date } = body;

    await run(
      db,
      'UPDATE jobs SET company = ?, title = ?, location = ?, salary = ?, status = ?, url = ?, notes = ?, applied_date = ? WHERE id = ?',
      [company, title, location, salary, status, url, notes, applied_date, id]
    );

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
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

    await run(db, 'DELETE FROM jobs WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  } finally {
    db.close();
  }
}

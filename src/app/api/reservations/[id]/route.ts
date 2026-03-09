import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// PUT /api/reservations/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (body.start_time && body.end_time && body.start_time >= body.end_time) {
    return NextResponse.json({ error: '종료 시간은 시작 시간보다 늦어야 합니다.' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const allowedFields = ['date', 'start_time', 'end_time', 'title', 'memo', 'created_by'];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = typeof body[field] === 'string' ? body[field].trim() || null : body[field];
    }
  }
  // title은 null 불가
  if (updateData.title === null) {
    return NextResponse.json({ error: '제목은 필수입니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reservations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/reservations/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

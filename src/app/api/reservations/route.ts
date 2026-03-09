import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reservations?year=2026&month=3
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const year = parseInt(searchParams.get('year') || '');
  const month = parseInt(searchParams.get('month') || '');

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: 'year, month 파라미터가 필요합니다.' }, { status: 400 });
  }

  // month는 1-indexed로 받음
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('start_time');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/reservations
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, start_time, end_time, title, memo, created_by } = body;

  if (!date || !start_time || !end_time || !title?.trim()) {
    return NextResponse.json({ error: '필수 필드를 입력해주세요.' }, { status: 400 });
  }

  if (start_time >= end_time) {
    return NextResponse.json({ error: '종료 시간은 시작 시간보다 늦어야 합니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      date,
      start_time,
      end_time,
      title: title.trim(),
      memo: memo?.trim() || null,
      created_by: created_by?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

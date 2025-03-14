import { NextResponse } from 'next/server';
import { fetchListPages } from '@/lib/scraper/bid';

export async function POST(req: Request) {
  try {
    const { names } = await req.json();
    const results = await fetchListPages(names);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Scraper error:', error);
    return NextResponse.json({ error: '스크래핑 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

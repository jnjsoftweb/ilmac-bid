import { pool } from '@/lib/db';
// Notice 타입 임포트 제거
// import { Notice } from '@/types/notice';

interface Notice {
  nid: number;
  title: string;          // 제목
  organization: string;   // 기관명
  createdAt: string;     // 작성일
  detailUrl: string;     // 상세페이지주소
  category?: string;
  region?: string;       // 지역
  registration?: string; // 등록
}

export async function getCategoryKeywords(categoryType: string) {
  console.log('Fetching keywords for category:', categoryType);

  const [rows] = await pool.query(
    `SELECT 
      적용분야 as categoryType,
      검색어 as keywords,
      배제어 as nots,
      최소점수 as minPoint,
      적용기관 as orgNames
    FROM settings_keyword 
    WHERE 적용분야 = ?`,
    [categoryType]
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const row = rows[0] as any;
  return {
    categoryType: row.categoryType,
    keywords: row.keywords.split(','),
    nots: row.nots.split(','),
    minPoint: parseInt(row.minPoint),
    orgNames: row.orgNames.split(','),
  };
}

function getDateBefore(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export async function getNoticesByCategory(category: string): Promise<Notice[]> {
  try {
    const keywords = await getCategoryKeywords(category);
    if (!keywords) {
      console.log('No keywords found for category:', category);
      return [];
    }

    const viewDayInterval = parseInt(process.env.VIEW_DAY_INTERVAL || '5', 10);
    const startDate = getDateBefore(viewDayInterval);

    // 1. 키워드 검색 결과 가져오기
    let matchedNids = new Map<number, { matched: string[]; point: number }>();
    
    for (const keyword of keywords.keywords) {
      const [kw, weightStr] = keyword.split('*');
      const weight = parseInt(weightStr || '1', 10);

      const [rows] = await pool.query(
        `SELECT nid, 제목 FROM notices WHERE 제목 LIKE ? AND 작성일 >= ?`,
        [`%${kw.trim()}%`, startDate]
      );

      if (Array.isArray(rows)) {
        for (const row of rows as any[]) {
          const nid = row.nid;
          if (matchedNids.has(nid)) {
            const current = matchedNids.get(nid)!;
            current.matched.push(kw);
            current.point += weight;
            matchedNids.set(nid, current);
          } else {
            matchedNids.set(nid, {
              matched: [kw],
              point: weight
            });
          }
        }
      }
    }

    // 2. 최소 점수 필터링
    const qualifiedNids = Array.from(matchedNids.entries())
      .filter(([_, data]) => data.point >= keywords.minPoint)
      .map(([nid]) => nid);

    if (qualifiedNids.length === 0) {
      return [];
    }

    // 3. 배제어 필터링 및 최종 결과 조회
    const [notices] = await pool.query(
      `SELECT 
        n.nid,
        n.작성일 as createdAt,
        n.기관명 as organization,
        n.제목 as title,
        n.상세페이지주소 as detailUrl,
        sl.등록 as registration,
        sl.지역 as region
      FROM notices n
      LEFT JOIN settings_list sl ON n.기관명 = sl.기관명
      WHERE n.nid IN (?) AND n.제목 NOT REGEXP ?
      ORDER BY n.작성일 DESC`,
      [qualifiedNids, keywords.nots.join('|')]
    );

    return (notices as any[]).map(notice => ({
      nid: notice.nid,
      title: notice.title,
      organization: notice.organization,
      createdAt: notice.createdAt,
      detailUrl: notice.detailUrl,
      region: notice.region || '-',
      registration: notice.registration || '-',
    }));

  } catch (error) {
    console.error('Error in getNoticesByCategory:', error);
    return [];
  }
}

export async function fetchAllNotices(limit: number): Promise<Notice[]> {
  try {
    const [rows] = await pool.query(
      `SELECT 
        n.nid,
        n.작성일 as createdAt,
        n.기관명 as organization,
        n.제목 as title,
        n.상세페이지주소 as detailUrl,
        sl.등록 as registration,
        sl.지역 as region
      FROM notices n
      LEFT JOIN settings_list sl ON n.기관명 = sl.기관명
      ORDER BY n.작성일 DESC
      LIMIT ?`,
      [limit]
    );

    return (rows as any[]).map(row => ({
      nid: row.nid,
      title: row.title,
      organization: row.organization,
      createdAt: row.createdAt,
      detailUrl: row.detailUrl,
      registration: row.registration || '-',
      region: row.region || '-',
    }));
  } catch (error) {
    console.error('Error in fetchAllNotices:', error);
    return [];
  }
}

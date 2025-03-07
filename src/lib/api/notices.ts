import { pool } from '@/lib/db';
import { Notice } from '@/types/notice';

interface Notice {
  nid: number;
  제목: string;
  기관명: string;
  작성일: string;
  상세페이지주소: string;
  category?: string;
  지역?: string;
  등록?: string;
}

interface RawNotice {
  nid: string | number;
  제목: string;
  기관명: string;
  작성일: string;
  상세페이지주소: string;
  지역?: string;
  등록?: string;
}

function convertArrayToNotice(arr: any[]): RawNotice {
  const [nid, 작성일, 기관명, 제목, 상세페이지주소, 등록, 지역] = arr;
  return {
    nid: nid || 0,
    작성일: 작성일 || '',
    기관명: 기관명 || '',
    제목: 제목 || '',
    상세페이지주소: 상세페이지주소 || '',
    등록: 등록,
    지역: 지역,
  };
}

function convertToNotice(raw: RawNotice | any[]): Notice {
  // 배열인 경우 객체로 변환
  const noticeData: RawNotice = Array.isArray(raw) ? convertArrayToNotice(raw) : raw;

  const nid = typeof noticeData.nid === 'string' ? parseInt(noticeData.nid, 10) : Number(noticeData.nid);

  if (isNaN(nid)) {
    console.error(`Warning: Invalid nid value: ${noticeData.nid}, using 0 instead`);
    return {
      nid: 0,
      제목: noticeData.제목 || '',
      기관명: noticeData.기관명 || '',
      작성일: noticeData.작성일 || '',
      상세페이지주소: noticeData.상세페이지주소 || '',
      지역: noticeData.지역,
      등록: noticeData.등록,
    };
  }

  return {
    nid,
    제목: noticeData.제목 || '',
    기관명: noticeData.기관명 || '',
    작성일: noticeData.작성일 || '',
    상세페이지주소: noticeData.상세페이지주소 || '',
    지역: noticeData.지역,
    등록: noticeData.등록,
  };
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

  console.log('Query result rows:', rows);

  if (!Array.isArray(rows) || rows.length === 0) {
    console.log('No rows found in settings_keyword table');
    return null;
  }

  const row = rows[0] as any;
  const result = {
    categoryType: row.categoryType,
    keywords: row.keywords.split(','),
    nots: row.nots.split(','),
    minPoint: parseInt(row.minPoint),
    orgNames: row.orgNames.split(','),
  };

  console.log('Parsed category keywords:', result);
  return result;
}

function getDateBefore(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export async function fetchNoticesByCategory(categoryType: string) {
  console.log('Fetching notices for category:', categoryType);

  const keywords = await getCategoryKeywords(categoryType);
  if (!keywords) {
    console.log('No keywords found for category:', categoryType);
    return [];
  }

  console.log('Category keywords:', keywords);

  // .env에서 VIEW_DAY_INTERVAL 값을 가져옴 (기본값 5일)
  const viewDayInterval = parseInt(process.env.VIEW_DAY_INTERVAL || '5', 10);
  const startDate = getDateBefore(viewDayInterval);

  console.log('Using date range:', startDate, 'to now');

  const testBody = {
    keywords: keywords.keywords.join(','),
    nots: keywords.nots.join(','),
    min_point: keywords.minPoint,
    add_where: `\`작성일\` >= '${startDate}'`,
    base_sql:
      'SELECT notices.nid, notices.`작성일`, notices.`기관명`, notices.`제목`, notices.`상세페이지주소`, settings_list.`등록`, settings_list.`지역` FROM notices LEFT JOIN settings_list ON notices.`기관명` = settings_list.`기관명`',
    add_sql: 'ORDER BY notices.`작성일` DESC',
  };

  console.log('Sending request with body:', testBody);

  try {
    const response = await fetch('http://1.231.118.217:8002/notices_by_search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBody),
    });

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('API response data:', data);

    const mappedData = data.map((row: any) => ({
      nid: 0, // 임시 ID
      title: row[3],
      organization: row[2],
      createdAt: row[1],
      detailUrl: row[4],
      registration: row[5] || '',
      region: row[6] || '',
    }));

    console.log('Mapped data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error in fetchNoticesByCategory:', error);
    return [];
  }
}

export async function fetchAllNotices(limit: number): Promise<Notice[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://1.231.118.217:8002';

  try {
    const response = await fetch(`${API_URL}/fetch_by_sql/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
          SELECT 
            notices.nid,
            notices.작성일,
            notices.기관명,
            notices.제목,
            notices.상세페이지주소,
            settings_list.등록,
            settings_list.지역
          FROM notices 
          LEFT JOIN settings_list ON notices.기관명 = settings_list.기관명 
          ORDER BY notices.작성일 DESC 
          LIMIT ${limit}`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notices');
    }

    const data = await response.json();
    console.log('API response data:', data);

    return data.map((row: any) => ({
      nid: parseInt(row[0]) || 0,
      title: row[3] || '',
      organization: row[2] || '',
      createdAt: row[1] || '',
      detailUrl: row[4] || '',
      registration: row[5] || '',
      region: row[6] || '',
    }));
  } catch (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
}

export interface Notice {
  nid: number;
  title: string;
  organization: string;
  createdAt: string;
  detailUrl: string;
  category?: string;
  region?: string;
  registration?: string;
  scrapDate?: string;
}

export interface RawNotice {
  nid: string | number;
  제목: string;
  기관명: string;
  작성일: string;
  상세페이지주소: string;
  지역?: string;
  등록?: string;
}

export interface NoticeRow {
  nid: number;
  작성일: string;
  기관명: string;
  제목: string;
  상세페이지주소: string;
  등록?: string;
  지역?: string;
}

import { WebDriver } from 'selenium-webdriver';

export type ElementConfig = [string, string?, string?];

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  iframe?: string;
  rowXpath: string;
  paging?: string;
  startPage: number;
  endPage: number;
  login?: string;
  elements: {
    [key: string]: ElementConfig;
  };
}

export interface DBSettings {
  기관명: string;
  url: string;
  iframe: string | null;
  rowXpath: string;
  paging: string;
  startPage: number;
  endPage: number;
  login: string | null;
  제목: string | null;
  상세페이지주소: string | null;
  작성일: string | null;
  작성자: string | null;
  제외항목: string | null;
  use: number;
  지역: string;
  등록: number;
  [key: string]: string | number | null;
}

export interface Notice {
  기관명: string;
  제목?: string;
  상세페이지주소?: string;
  작성일?: string;
  작성자?: string;
  scraped_at: string;
  sn?: number;
}

export interface ElementValue {
  text: string;
  href?: string;
  [key: string]: any;
}

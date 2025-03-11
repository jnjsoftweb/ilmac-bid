import { pool } from '@/lib/db';

export interface SettingsList {
  기관명: string;
  url: string | null;
  iframe: string | null;
  rowXpath: string | null;
  paging: string | null;
  startPage: number | null;
  endPage: number | null;
  login: string | null;
  제목: string | null;
  상세페이지주소: string | null;
  작성일: string | null;
  작성자: string | null;
  제외항목: string | null;
  use: boolean | null | number;
  지역: string | null;
  등록: number | null;
}

export async function fetchSettingsList(): Promise<SettingsList[]> {
  try {
    const [rows] = await pool.query(`SELECT * FROM settings_list ORDER BY 기관명 ASC`);
    return rows as SettingsList[];
  } catch (error) {
    console.error('Error fetching settings list:', error);
    return [];
  }
}

export async function updateSettingsList(setting: SettingsList) {
  try {
    await pool.query(`UPDATE settings_list SET ? WHERE 기관명 = ?`, [setting, setting.기관명]);
    return true;
  } catch (error) {
    console.error('Error updating settings list:', error);
    return false;
  }
}

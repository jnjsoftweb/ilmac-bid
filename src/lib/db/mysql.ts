import mysql from 'mysql2/promise';

export default class MySQL {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '1.231.118.217',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'mysqlIlmac1!',
      database: process.env.MYSQL_DATABASE || 'Bid',
      port: parseInt(process.env.MYSQL_PORT || '2306', 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  /**
   * 데이터베이스 연결 종료
   */
  async close(): Promise<void> {
    await this.pool.end();
  }

  /**
   * SQL 쿼리 실행
   */
  async fetch(sql: string, limit: number = 0): Promise<any | any[] | null> {
    try {
      const [rows] = await this.pool.query(sql);
      if (!Array.isArray(rows)) return null;

      if (limit === 1) {
        return rows.length > 0 ? rows[0] : null;
      }

      return limit > 0 ? rows.slice(0, limit) : rows;
    } catch (e) {
      console.error('Error in fetch:', e);
      return null;
    }
  }

  /**
   * 테이블 조회
   */
  async find(tableName: string, fields: string[] | null = null, addStr: string = ''): Promise<any | any[] | null> {
    const fieldStr = fields ? fields.join(',') : '*';
    const sql = `SELECT ${fieldStr} FROM ${tableName} ${addStr}`;
    return this.fetch(sql);
  }

  /**
   * 데이터 삽입 또는 업데이트
   */
  async upsert(data: any[][], tableName: string, uniqueFields: string[]): Promise<void> {
    if (data.length < 2) return;

    const fields = data[0];
    const values = data.slice(1);
    const placeholders = values.map(() => '(' + fields.map(() => '?').join(',') + ')').join(',');

    const duplicateUpdate = fields
      .filter((field) => !uniqueFields.includes(field))
      .map((field) => `${field}=VALUES(${field})`)
      .join(',');

    const sql = `
      INSERT INTO ${tableName} (${fields.join(',')})
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE ${duplicateUpdate}
    `;

    try {
      await this.pool.query(sql, values.flat());
    } catch (e) {
      console.error('Error in upsert:', e);
    }
  }

  /**
   * 기관명으로 마지막 공지사항 조회
   */
  async findLastNotice(name: string, field: string = '제목'): Promise<[number | null, string | null]> {
    const sql = `
      SELECT sn, ${field}
      FROM notices
      WHERE 기관명='${name}'
      ORDER BY sn DESC
      LIMIT 1
    `;

    const result = await this.fetch(sql, 1);

    if (!result || Array.isArray(result)) return [null, null];
    return [result.sn, result[field]];
  }

  /**
   * 기관명으로 설정 조회
   */
  async noticeConfigByName(name: string): Promise<any | null> {
    try {
      const addStr = `WHERE 기관명='${name}'`;
      const result = await this.find('settings_list', null, addStr);

      if (!result || Array.isArray(result)) {
        console.error(`설정을 찾을 수 없습니다: ${name}`);
        return null;
      }

      const row = result;
      console.log('@@@ Raw settings row:', row);

      const elementFields = ['제목', '상세페이지주소', '작성일', '작성자', '제외항목'];
      const SEPARATOR = '|-';

      const elements = {};
      elementFields.forEach((field) => {
        const value = row[field];
        if (typeof value === 'string' && value.trim() !== '') {
          const parts = value.split(SEPARATOR);
          const xpath = parts[0].trim();

          if (xpath !== '') {
            const element = [xpath];

            if (parts.length >= 2 && parts[1].trim() !== '') {
              element.push(parts[1].trim());
            }

            if (parts.length === 3 && parts[2].trim() !== '') {
              element.push(parts[2].trim());
            }

            elements[field] = element;
          }
        }
      });

      console.log('@@@ Constructed elements:', elements);

      return {
        name: name,
        baseUrl: row.url,
        iframe: row.iframe || undefined,
        rowXpath: row.rowXpath,
        paging: row.paging || undefined,
        startPage: Number(row.startPage) || 1,
        endPage: Number(row.endPage) || 1,
        login: row.login || undefined,
        elements: elements,
      };
    } catch (e) {
      console.error(`Error in noticeConfigByName for ${name}:`, e);
      return null;
    }
  }
}

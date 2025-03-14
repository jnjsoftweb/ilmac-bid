import * as cheerio from 'cheerio';
import { ElementValue, ElementConfig } from './types.js';
import { parse } from 'node-html-parser';

/**
 * HTML 요소에서 값을 추출
 */
const getValue = (element: cheerio.Element, $: cheerio.CheerioAPI): ElementValue => {
  const result: ElementValue = {
    text: $(element).text().trim(),
  };

  const href = $(element).attr('href');
  if (href) {
    result.href = href.trim();
  }

  return result;
};

/**
 * 콜백 함수 실행
 */
const executeCallback = (rst: string, callback: string): string => {
  try {
    return new Function('rst', `return ${callback}`)(rst);
  } catch (e) {
    console.error('Callback execution error:', e);
    return rst;
  }
};

/**
 * HTML에서 데이터 추출
 */
export function getRows(html: string, rowXpath: string, elements: { [key: string]: [string, string?, string?] }): any[] {
  const $ = cheerio.load(html);
  const rows: { [key: string]: string }[] = [];

  try {
    $(rowXpath).each((_, row) => {
      const item: { [key: string]: string } = {};

      for (const [field, config] of Object.entries(elements)) {
        if (!config || config.length === 0) continue;

        const [xpath, target, callback] = config;
        const element = $(row).find(xpath);

        if (element.length > 0) {
          const value = getValue(element[0], $);
          let rst = target && value[target] ? value[target] : value.text;

          if (callback) {
            rst = executeCallback(rst, callback);
          }

          item[field] = rst;
        }
      }

      if (Object.keys(item).length > 0) {
        rows.push(item);
      }
    });
  } catch (e) {
    console.error('Error in getRows:', e);
  }

  return rows;
}

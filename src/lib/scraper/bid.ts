import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import MySQL from '../db/mysql';
import { getRows } from './lxml';
import { HEADLESS, KST, TABLE_NOTICES, CHROME_OPTIONS } from './config';
import type { Notice, ScraperConfig } from './types.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const mysql = new MySQL();

/**
 * 현재 시간 반환 (KST)
 */
const now = (): string => dayjs().tz(KST).format('YYYY-MM-DD HH:mm:ss');

/**
 * 목록 데이터 DB 입력
 */
const insertListData = async (csv: string[][]): Promise<string[][] | undefined> => {
  if (csv.length < 2) {
    console.log('!!!게시글이 없습니다.');
    return;
  }

  const data0 = [...csv[0], 'sn'];
  const data = [data0];
  const index1 = csv[0].indexOf('기관명');
  const index2 = csv[0].indexOf('상세페이지주소');

  const [lastSn] = await mysql.findLastNotice(csv[1][index1]);
  let currentSn = lastSn || 0;

  const limit = Math.max(100, csv.length);
  const detailUrls = (await mysql.find(
    TABLE_NOTICES,
    ['상세페이지주소'],
    `WHERE 기관명='${csv[1][index1]}' ORDER BY sn DESC LIMIT ${limit}`
  )) as { 상세페이지주소: string }[];

  const existingUrls = detailUrls.map((row) => row['상세페이지주소']);

  for (const row of csv.slice(1)) {
    if (!existingUrls.includes(row[index2])) {
      currentSn++;
      data.push([...row, currentSn.toString()]);
    }
  }

  if (data.length > 1) {
    console.log(`+++++추가 게시물: ${data.length - 1}`);
    await mysql.upsert(data, TABLE_NOTICES, ['상세페이지주소']);
  } else {
    console.log('****추가된 게시글이 없습니다.');
  }

  return data;
};

/**
 * 게시판 목록 페이지 스크래핑
 */
export const fetchListPages = async (names: string[], save: boolean = false): Promise<Notice[][]> => {
  const options = new chrome.Options();
  const results: Notice[][] = [];

  if (HEADLESS) {
    options.addArguments('--headless');
  }
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-setuid-sandbox');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    console.log('='.repeat(80));
    console.log(`@@@@@ Scrape Notices At: ${now()}`);
    console.log('-'.repeat(80));

    for (const [nth, name] of names.entries()) {
      let isError = false;
      console.log(`### ${name} (${nth})@fetch_list_pages`);

      const config = await mysql.noticeConfigByName(name);
      if (!config) {
        console.error(`설정을 찾을 수 없습니다: ${name}`);
        continue;
      }

      if (!config.baseUrl || !config.rowXpath || !config.elements || Object.keys(config.elements).length === 0) {
        console.error(`필수 설정이 누락되었습니다: ${name}`);
        console.error('url:', config.baseUrl);
        console.error('rowXpath:', config.rowXpath);
        console.error('elements:', JSON.stringify(config.elements, null, 2));
        continue;
      }

      const orgResults: Notice[] = [];

      try {
        // 초기 페이지 로딩
        await driver.get(config.baseUrl.replace('${i}', config.startPage.toString()));
        await driver.wait(until.elementLocated(By.xpath(config.rowXpath)), 120000);

        for (let i = config.startPage; i <= config.endPage; i++) {
          console.log(`@@@ Processing page: ${i}`);

          // iframe 처리
          if (config.iframe) {
            await driver.wait(until.elementLocated(By.css(config.iframe)), 60000);
            await driver.switchTo().frame(await driver.findElement(By.css(config.iframe)));
          }

          await driver.wait(until.elementLocated(By.xpath(config.rowXpath)), 60000);
          const html = await driver.getPageSource();

          // iframe에서 메인 프레임으로 복귀
          if (config.iframe) {
            await driver.switchTo().defaultContent();
          }

          try {
            const data = getRows(html, config.rowXpath, config.elements);
            console.log(`@@@ Extracted data:`, data);
            if (data.length === 0) break;

            // 데이터 처리
            const notices: Notice[] = data.map((item) => ({
              ...item,
              기관명: name,
              scraped_at: now(),
            }));

            console.log(`@@@ notices: ${JSON.stringify(notices, null, 2)}`);
            orgResults.push(...notices);

            if (save) {
              const csv = notices.map((notice) => Object.values(notice));
              if (csv.length > 0) {
                await insertListData([Object.keys(notices[0]), ...csv]);
              }
            }

            // 다음 페이지로 이동
            if (i < config.endPage) {
              if (config.baseUrl.includes('${i}')) {
                await driver.get(config.baseUrl.replace('${i}', (i + 1).toString()));
              } else if (config.paging) {
                const nextPageXPath = config.paging.replace('${i}', (i + 1).toString());
                await driver.wait(until.elementLocated(By.xpath(nextPageXPath)), 60000);
                await driver.findElement(By.xpath(nextPageXPath)).click();
                await driver.sleep(1000);
              }
            }
          } catch (e) {
            console.error(`Error processing page ${i}:`, e);
            isError = true;
            break;
          }
        }
      } catch (e) {
        console.error(`Error processing organization ${name}:`, e);
        continue;
      }

      results.push(orgResults);
    }
  } finally {
    await driver.quit();
  }

  return results;
};

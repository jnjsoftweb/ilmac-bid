export const KST = 'Asia/Seoul';
export const TABLE_NOTICES = 'notices';
export const HEADLESS = true;
export const MAX_RETRY = 20;

export const CHROME_OPTIONS = {
  headless: ['--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
  common: ['--window-size=1920,1080', '--disable-notifications', '--disable-extensions', '--disable-popup-blocking'],
  userAgent:
    '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

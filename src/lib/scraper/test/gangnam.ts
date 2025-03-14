import { fetchListPages } from '../bid.js';
import MySQL from '../../db/mysql.js';

const mysql = new MySQL();

const main = async () => {
  try {
    const names = ['성동구'];
    await fetchListPages(names, false);
  } catch (e) {
    console.error('Error in main:', e);
  } finally {
    await mysql.close();
    process.exit(0); // 프로세스 명시적 종료
  }
};

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

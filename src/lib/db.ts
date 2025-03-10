import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '1.231.118.217',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'mysqlIlmac1!',
  database: process.env.MYSQL_DATABASE || 'Bid',
  port: parseInt(process.env.MYSQL_PORT || '2306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

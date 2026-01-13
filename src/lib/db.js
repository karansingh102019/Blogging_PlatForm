import mysql from "mysql2/promise";

let connection;

export async function getDB() {
  if (!connection) {
    connection = await mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }
  return connection;
}

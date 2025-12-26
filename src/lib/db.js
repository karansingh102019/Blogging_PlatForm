import mysql from "mysql2/promise";

let connection;

export async function getDB() {
  if (!connection) {
    connection = await mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "blog_platform",
    });
  }
  return connection;
}

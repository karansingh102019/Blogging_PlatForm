import mysql from "mysql2/promise";

let connection;

export async function getDB() {
  if (!connection) {
    connection = await mysql.createPool({
      host: "shinkansen.proxy.rlwy.net",
      port:"18717",
      user: "root",
      password: "OuRnwjCzUwfIVzpZrtBWYMOUvFhjgbYO",
      database: "railway",
    });
  }
  return connection;
}

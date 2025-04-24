import mysql from "mysql2";
import dotenv from "dotenv";
import { resolve } from "path";
import winston from "winston";

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/log.txt" }),
  ],
});

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getOpenings() {
  const [rows] = await pool.query(
    `
    SELECT songs.song_id, songs.song_name, songs.artist, openings.arcs, songs.youtube_link
    FROM openings
    LEFT JOIN songs
    ON openings.song_id = songs.song_id
    `
  );
  return rows;
}
export async function getOpeningById(id) {
  const [rows] = await pool.query(
    `
    SELECT songs.song_id, songs.song_name, songs.artist, openings.arcs, songs.youtube_link
    FROM openings
    LEFT JOIN songs
    ON openings.song_id = songs.song_id
    WHERE op_id = ?`,
    [id]
  );
  return rows[0];
}

export async function getSongs() {
  const [rows] = await pool.query(
    `
  SELECT *
  FROM songs
  `
  );
  return rows;
}

export async function getSongsById(id) {
  const [rows] = await pool.query(
    `
  SELECT *
  FROM songs
  WHERE song_id = ?
  `,
    [id]
  );
  return rows[0];
}

export async function createSongs(id, song_name, artist, youtube_link) {
  try {
    const [results] = await pool.query(
      `
      INSERT INTO songs (song_id, song_name, artist, youtube_link)
      VALUES (?, ?, ?, ?)
      `,
      [id, song_name, artist, youtube_link]
    );
    return results.insertId;
  } catch (error) {
    console.log(error.message);
  }
}

export async function createOpening(id, song_id, arcs) {
  try {
    const [results] = await pool.query(
      `
      INSERT INTO openings(op_id, song_id, arcs)
      VALUES (?, ?,?)
      `,
      [id, song_id, arcs]
    );
    return results;
  } catch (error) {
    console.log(error.message);
  }
}

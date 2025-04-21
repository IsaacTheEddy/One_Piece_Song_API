CREATE DATABASE IF NOT EXISTS One_Piece_Songs;
USE One_Piece_Songs;

CREATE TABLE IF NOT EXISTS songs(
    song_id INT PRIMARY KEY AUTO_INCREMENT,
    song_name TEXT,
    artist TEXT,
    youtube_link TEXT
);

CREATE TABLE IF NOT EXISTS openings(
    op_id SERIAL PRIMARY KEY,
    song_id INT,
    arcs TEXT,
    FOREIGN KEY(song_id) REFERENCES songs(song_id)
);

CREATE TABLE IF NOT EXISTS endings(
    ep_id INT PRIMARY KEY,
    song_id INT,
    arcs TEXT,
    FOREIGN KEY(song_id) REFERENCES songs(song_id)
);

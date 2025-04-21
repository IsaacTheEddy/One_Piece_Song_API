import parser from "csv-parser";
import fs from "fs";

import { createSongs, createOpening } from "./database.js";

async function Songs() {
  const rows = await new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream("./Song_List.csv")
      .pipe(parser({}))
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results));
  });
  try {
    for (const row of rows) {
      if (row !== rows.length) {
        const Id = row.Id;
        const song_name = row.song_name;
        const arcs = row.arcs;
        const artist = row.artist;
        const youtube_link = row.youtube_link;

        console.log(song_name);

        const songs = await createSongs(Id, song_name, artist, youtube_link);

        await createOpening(Id, songs, arcs);
      }
    }
  } catch (error) {
    console.log("Here");
  }
}

Songs();

import express from "express";
import { getOpenings, getOpeningById, getSongs, getSongsById } from "./database.js";

import AC from "./controllers/App.js";
import UC from "./controllers/Users.js";
import AT from "./controllers/Auth.js";
import winston from "winston";

const app = express();
const PORT = 5000;

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/log.txt" }),
  ],
});

app.use(express.json());

// GETs
app.get("/status", async (req, res) => {
  logger.info("Checked the Status of the databases");
  res.send(await AC.getStatus());
});

app.get("/stats", async (req, res) => {
  res.send(await AC.getStats());
});

app.get("/connect", (req, res, next) => {
  AT.getConnect(req, res)
    .then((auth) => auth)
    .catch(next);
});
app.get("/disconnect", (req, res, next) => {
  AT.getDisconnect(req, res)
    .then((auth) => auth)
    .catch(next);
});
app.get("/users/me", (req, res, next) => {
  UC.getMe(req, res)
    .then((result) => result)
    .catch(next);
});

app.get("/openings", (req, res, next) => {
  AT.getShow(req, res)
    .then((results) => results)
    .catch(next)
});

app.get("/openings/:id", (req, res, next) => {
  let id = req.params.id
  AT.getShowById(req, res, id)
    .then((results) => results)
    .catch(next)
});

app.get('/songs', (req, res, next) => {
  AT.getSongs(req, res)
  .then((results) => results)
  .catch(next)
})

app.get('/songs/:id',(req, res, next) => {
  let id = req.params.id
  AT.getSongsById(req, res, id)
  .then((results) => results)
  .catch(next)
})

//POSTs
app.post("/users", async (req, res) => {
  UC.postNew(req, res);
});

app.listen(PORT, () => {
  logger.info(`Running on port 5000`);
});

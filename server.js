import express from "express";
import { getOpenings, getOpeningById } from "./database.js";

import AC from "./controllers/App.js";
import UC from "./controllers/Users.js";
import AT from "./controllers/Auth.js";
import winston from "winston";

const app = express();
const PORT = 5000;

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/log" }),
  ],
});

app.use(express.json());

// GETs
app.get("/status", async (req, res) => {
  logger.warn("");
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

//POSTs
app.post("/users", async (req, res) => {
  UC.postNew(req, res);
});

app.listen(PORT, () => {
  console.log(`Running on port 5000`);
});

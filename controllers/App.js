import { json } from "express";
import redisClient from "../utils/redis.js";
import dbClient from "../utils/mongoDB.js";
import winston from "winston";

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/log.txt" }),
  ],
});

class AppController {
  constructor() {}

  async getStatus(request, response) {
    try {
      const redis = await redisClient.isAlive();
      const db = await dbClient.isAlive();
      logger.info(`Databases are on and connected`);
      return { redis, db };
    } catch (error) {
      console.error("Error", error);
    }
  }

  async getStats(request, response) {
    try {
      const users = await dbClient.nbUsers();
      logger.info("Success for the stats");
      return { users };
    } catch (error) {
      console.error("Error", error);
      return { users: 0, files: 0 };
    }
  }
}

const AC = new AppController();
export default AC;

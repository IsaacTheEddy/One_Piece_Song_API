import { json } from "express";
import redisClient from "../utils/redis.js";
import dbClient from "../utils/mongoDB.js";

class AppController {
  constructor() {}

  async getStatus(request, response) {
    try {
      const redis = await redisClient.isAlive();
      const db = await dbClient.isAlive();
      console.log("Success");
      return { redis, db };
    } catch (error) {
      console.error("Error", error);
    }
  }

  async getStats(request, response) {
    try {
      const users = await dbClient.nbUsers();
      console.log("Success stats");
      return { users };
    } catch (error) {
      console.error("Error", error);
      return { users: 0, files: 0 };
    }
  }
}

const AC = new AppController();
export default AC;

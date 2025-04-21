import crypto from "crypto";
import redisClient from "../utils/redis.js";
import dbClient from "../utils/mongoDB.js";
import sha1 from "sha1";
import { ObjectId } from "mongodb";

class UsersController {
  async postNew(req, res) {
    const { email, password } = req.body; // Destructure from req.body

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    if (!password) {
      return res.status(400).json({ error: "Missing password" });
    }

    const db = dbClient.getDB();
    if (!db) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    try {
      const existing = await db.collection("users").findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "Already exist" });
      }

      const hashed = sha1(password);

      const { insertedId } = await db
        .collection("users")
        .insertOne({ email, password: hashed });

      res.status(201).json({ id: insertedId.toString(), email });
    } catch (err) {
      console.error("UsersController.postNew error:", err.message);
      return res.status(500).json({ error: "Internal error" });
    }
  }
  async getMe(req, res) {
    const token = req.headers["x-token"];

    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized 1" });
    }

    const db = dbClient.getDB();
    if (!db) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    const redisKey = `auth_${token}`;
    console.log(redisKey);
    const userId = await redisClient.get(redisKey);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized 2" });
    }
    console.log(`money ${userId}`);
    try {
      console.log("running");
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

      // console.log(`more money ${user.email}`);
      if (!user) {
        return res.status(401).json({ error: "no user at all" });
      }
      const result = { id: user._id, email: user.email };

      return res.json(result); // Return id and email only
    } catch (error) {
      console.error("Error in getMe:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

const UC = new UsersController();
export default UC;

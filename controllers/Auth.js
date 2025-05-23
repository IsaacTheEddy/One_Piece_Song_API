import { v4 as uuidv4 } from "uuid";
import redisClient from "../utils/redis.js";
import dbClient from "../utils/mongoDB.js";
import { ObjectId } from "mongodb";
import { getOpenings, getOpeningById, getSongs, getSongsById } from "../database.js";
import sha1 from "sha1";
import winston from "winston";

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/log.txt" }),
  ],
});

class AuthController {
  constructor() { }
  async getConnect(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      console.log(credentials);
      const [email, password] = credentials.split(":");
      console.log(email, password);

      if (!email || !password) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Find user with matching email and SHA1(password)
      const hashedPassword = sha1(password);

      console.log(hashedPassword);
      const user = await dbClient.db
        .collection("users")
        .findOne({ email, password: hashedPassword });
      console.log("user Found", user._id);

      if (!user) {
        return res.status(401).json({ error: "No User" });
      }

      // Generate a token and store it in Redis for 24h (86400 seconds)
      const token = uuidv4();
      console.log("Token", token);
      const redisKey = `auth_${token}`;
      console.log("Redis key", redisKey);
      const setter = async () => {
        try {
          await redisClient.set(redisKey, user._id.toString(), 86400);
          logger.info("Added redis key to redis server");
        } catch (error) {
          logger.error(error, "hello");
        }
      };

      setter();
      logger.info(`${email} succesfully connected`)

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getDisconnect(req, res) {
    try {
      const token = req.headers["x-token"];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const redisKey = `auth_${token}`;
      const userId = await redisClient.get(redisKey);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      let del = await redisClient.del(redisKey)
      .then(logger.info(`Deleted Redis Token ${redisKey}`));
      return res.status(204).json(del);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getShow(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const db = dbClient.getDB();
    if (!db) {
      return res.status(500).json({ error: 'No connection' });
    }

    const redisKey = `auth_${token}`;
    const userID = await redisClient.get(redisKey);
    if (!userID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userID) })
      if (!user) {
        return res.status(401).json({ error: 'Not found 1' })
      }
      const openings = await getOpenings();

      if (!openings) {
        return res.status(404).json({ openings })
      }
      logger.info(`${user.email} succesfully queried openings`)
      return res.json(openings)
    } catch (err) {
      return logger.error(err.message)
    }
  }

  async getShowById(req, res, id) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const db = dbClient.getDB();
    if (!db) {
      return res.status(500).json({ error: 'No connection' });
    }

    const redisKey = `auth_${token}`;
    const userID = await redisClient.get(redisKey);
    if (!userID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userID) })
      if (!user) {
        return res.status(401).json({ error: 'Not found 1' })
      }
      const openings = await getOpeningById(id);

      if (!openings) {
        return res.status(404).json({ openings })
      }
      logger.info(`${user.email} succesfully queried openings by ID`)
      return res.json(openings)
    } catch (err) {
      return logger.error(err.message)
    }
  }

  async getSongs(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const db = dbClient.getDB();
    if (!db) {
      return res.status(500).json({ error: 'No connection' });
    }

    const redisKey = `auth_${token}`;
    const userID = await redisClient.get(redisKey);
    if (!userID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userID) })
      if (!user) {
        return res.status(401).json({ error: 'Not found 1' })
      }
      const songs = await getSongs();

      if (!songs) {
        return res.status(404).json({ songs })
      }
      logger.info(`${user.email} succesfully queried songs`)
      return res.json(songs)
    } catch (err) {
      return logger.error(err.message)
    }
  }

  async getSongsById(req, res, id) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const db = dbClient.getDB();
    if (!db) {
      return res.status(500).json({ error: 'No connection' });
    }

    const redisKey = `auth_${token}`;
    const userID = await redisClient.get(redisKey);
    if (!userID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userID) })
      if (!user) {
        return res.status(401).json({ error: 'Not found 1' })
      }
      const song = await getSongsById(id);

      if (!song) {
        return res.status(404).json({ song })
      }
      logger.info(`${user.email} succesfully queried openings by ID`)
      return res.json(song)
    } catch (err) {
      return logger.error(err.message)
    }
}
}







const AT = new AuthController();
export default AT;

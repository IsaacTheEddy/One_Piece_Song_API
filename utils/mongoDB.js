import { MongoClient, ObjectId } from "mongodb";

class DBClient {
  constructor() {
    // Include the database name in the connection URL
    this.url = `mongodb+srv://root:root@onepiece.aojhf0o.mongodb.net/OnePieceSongs?retryWrites=true&w=majority`; // Replace placeholders
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });

    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db();
      console.log(`Connected to MongoDB database: ${this.db.databaseName}`);
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }

  isAlive() {
    return (
      !!this.db &&
      !!this.client &&
      this.client.topology &&
      this.client.topology.isConnected()
    );
  }

  nbUsers() {
    if (!this.db) return 0; // Return 0 if not connected
    try {
      const count = this.db.collection("users").countDocuments();
      return count;
    } catch (error) {
      console.error("Error counting users:", error);
      return 0; // Return 0 on error
    }
  }

  getDB() {
    return this.db;
  }
}

// Create and export a single instance of DBClient
const dbClient = new DBClient();
export default dbClient;
export { ObjectId };

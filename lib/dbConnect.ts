import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://hrishitiwari1903:tpYUz1ZyRRRzAuHw@supertoken.drb5odg.mongodb.net/?retryWrites=true&w=majority";
// "mongodb://localhost:27017/workspace2"
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("DB connected from cache");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("DB connected");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

/*import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://hrishitiwari1903:zyrjuc-xyqzof-4Rimza@supertoken.drb5odg.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_DB = "workspaces";

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

// check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient = null;
let cachedDb = null;

export default async function dbConnect() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
*/

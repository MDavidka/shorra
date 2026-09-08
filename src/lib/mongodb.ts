import { MongoClient, Db } from "mongodb";

// Supports 'mogo' as requested by the user, or standard 'MONGODB_URI' / 'MONGO_URI'
const uri =
  process.env.mogo ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "";

const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve connection across module reloads
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri || !clientPromise) {
    return null;
  }
  try {
    return await clientPromise;
  } catch (error) {
    console.warn("MongoDB connection failed:", error);
    return null;
  }
}

export async function getDb(dbName = "shorra"): Promise<Db | null> {
  const clientInstance = await getMongoClient();
  if (!clientInstance) return null;
  return clientInstance.db(dbName);
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.trim().length > 0);
}

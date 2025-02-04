import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "❌ Please define the MONGODB_URI environment variable in .env.local"
  );
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "sample_mflix", // ✅ Explicitly connect to `sample_mflix`
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ Successfully connected to MongoDB!");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;

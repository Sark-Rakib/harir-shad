import mongoose from "mongoose";

export const DB_NAME = "harir_shad";

export async function connectDb(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri, { dbName: DB_NAME });
    console.log(`✅ MongoDB connected (db: ${DB_NAME})`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

// Serverless-friendly: connects but throws on failure instead of exiting.
export async function connectDbSafe(uri: string): Promise<void> {
  await mongoose.connect(uri, { dbName: DB_NAME });
}

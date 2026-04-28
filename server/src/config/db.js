import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(uri);
  isConnected = true;
  return mongoose.connection;
}

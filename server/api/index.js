import dotenv from "dotenv";
import serverless from "serverless-http";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();

let readyPromise;

async function ensureReady() {
  if (!readyPromise) {
    readyPromise = connectDB();
  }
  await readyPromise;
}

const handler = serverless(app);

export default async function vercelHandler(req, res) {
  await ensureReady();
  return handler(req, res);
}

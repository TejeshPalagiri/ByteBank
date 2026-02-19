import mongoose from "mongoose";
import * as config from "../index";

const connectionURI = `mongodb+srv://${config.MONGO_DB_USER}:${config.MONGO_DB_PASSWORD}@${config.MONGO_DB_HOST}/${config.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(connectionURI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("MongoDB Connected");

  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

mongoose.set("debug", process.env.NODE_ENV === "development");
mongoose.set("allowDiskUse", true);

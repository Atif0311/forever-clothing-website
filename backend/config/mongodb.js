import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB_NAME || "forever";

  if (!mongoUrl) {
    throw new Error("MongoDB connection string is missing. Add MONGODB_URI or MONGODB_URL to backend/.env");
  }

  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });

  const separator = mongoUrl.endsWith("/") ? "" : "/";
  await mongoose.connect(`${mongoUrl}${separator}${dbName}`, {
    serverSelectionTimeoutMS: 15000,
  });
};

export default connectDB;

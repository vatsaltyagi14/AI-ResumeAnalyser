import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true); //bas schema fields update krega

  // connected hai toh log karde bas
  if (connected) {
    console.log("MongoDB is already connected.");
    return;
  }

  // Connect kra idhar
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
};

export default connectDB;

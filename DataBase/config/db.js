import mongoose from "mongoose";


const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/flipr_project";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;

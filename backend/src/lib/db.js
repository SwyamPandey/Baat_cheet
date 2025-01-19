import mongoose from "mongoose";

export  const connectDB = async () => {
    const mongoURI = process.env.MONGO_URL; // Using the environment variable
    console.log("Connecting to MongoDB:", mongoURI);
    try {
        await mongoose.connect(mongoURI); // No need for deprecated options
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

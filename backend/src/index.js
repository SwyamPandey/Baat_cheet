import dotenv from "dotenv"; // Import dotenv package
dotenv.config();  // Configure dotenv to read environment variables

import express from "express";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js"
import cors from "cors";

// Create Express app instance
const app = express();

// Increase the limit of the request body
app.use(express.json({ limit: '10mb' })); // Set the desired size
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to handle CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend URL
    credentials: true, // Allow cookies and credentials to be sent
  })
);

const PORT = process.env.PORT || 5001; // Fallback to 5001 if PORT is not defined

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
  connectDB(); // Connect to the database
});

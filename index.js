
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./DataBase/config/db.js";
import cors from "cors";
import apiRoutes from "./routes/api.js";



const app = express();

// 1. Connect to Database
connectDB();

// 2. Init Middleware
app.use(express.json({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
); // Allow requests from your React/frontend app
app.use(express.json());


const PORT = process.env.PORT || 5000;

app.use("/api", apiRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

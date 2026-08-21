import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import outfitRoutes from "./routes/outfitRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes will be mounted here in later steps:
app.use("/api/auth", authRoutes);
app.use("/api/outfit", outfitRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });
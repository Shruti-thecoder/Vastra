import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email: email.toLowerCase(), password: passwordHash });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong." });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Incorrect email or password." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Incorrect email or password." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong." });
    }
});

export default router;
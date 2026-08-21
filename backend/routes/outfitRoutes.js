import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Outfit from "../models/Outfit.js";

const router = express.Router();

router.get("/history", requireAuth, async (req, res) => {
    try {
        const outfits = await Outfit.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(outfits);
    } catch (err) {
        res.status(500).json({ error: "Could not load history." });
    }
});

router.post("/generate", requireAuth, async (req, res) => {
    try {
        const { style, occasion, weather, budget, notes } = req.body;

        const summaryParts = [];
        if (style) summaryParts.push(`Style: ${style}`);
        if (occasion) summaryParts.push(`Occasion: ${occasion}`);
        if (weather) summaryParts.push(`Weather: ${weather}`);
        if (budget) summaryParts.push(`Budget: ${budget}`);
        if (notes) summaryParts.push(`Notes: ${notes}`);
        const summary = summaryParts.length ? summaryParts.join(" · ") : "Surprise me with something stylish.";

        const systemPrompt = `You are Vastra, an expert personal fashion stylist for an Indian shopping audience. Respond with ONLY a raw JSON object, no markdown fences, no prose, in exactly this shape:
{"intro": "one warm sentence introducing the look", "items": [{"category": "Top|Bottom|Dress|Footwear|Bag|Earrings|Accessory", "name": "short product name", "description": "one short sentence, under 18 words", "searchQuery": "concise shopping search phrase", "priceMin": number, "priceMax": number}]}
Include 4 to 6 complementary items forming ONE cohesive outfit. Respect the budget for the total look if given.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: "user", parts: [{ text: summary }] }]
                })
            }
        );

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const clean = text.replace(/^```json\s*|^```\s*|```$/g, "").trim();
        const parsed = JSON.parse(clean);

        await Outfit.create({
            userId: req.userId,
            filters: { style, occasion, weather, budget, notes },
            items: parsed.items || []
        });

        res.json(parsed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not generate an outfit right now." });
    }
});

export default router;
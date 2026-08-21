import mongoose from "mongoose";

const outfitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    filters: {
        gender: String,
        style: String,
        occasion: String,
        weather: String,
        budget: String,
        notes: String
    },
    items: [
        {
            category: String,
            name: String,
            description: String,
            searchQuery: String,
            priceMin: Number,
            priceMax: Number
        }
    ]
}, { timestamps: true });

export default mongoose.model("Outfit", outfitSchema);
import { useState, useEffect } from "react";
import api from "../api";
import OutfitCard from "./OutfitCard";

export default function History({ token }) {
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/outfit/history", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOutfits(res.data);
            } catch (err) {
                setError("Could not load your past looks.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [token]);

    if (loading) {
        return <div className="flex-1 flex items-center justify-center text-ivory-dim text-sm">Loading...</div>;
    }

    if (error) {
        return <div className="flex-1 flex items-center justify-center text-rose text-sm">{error}</div>;
    }

    if (outfits.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-ivory-dim gap-2 px-8">
                <h3 className="font-serif text-lg text-ivory">No looks yet</h3>
                <p className="text-[13px] max-w-xs">Generate an outfit in Chat and it'll show up here.</p>
            </div>
        );
    }

    function filterSummary(filters) {
        const parts = [];
        if (filters?.style) parts.push(filters.style);
        if (filters?.occasion) parts.push(filters.occasion);
        if (filters?.weather) parts.push(filters.weather);
        if (filters?.budget) parts.push(filters.budget);
        return parts.join(" · ") || filters?.notes || "Custom look";
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
            {outfits.map((outfit) => (
                <div key={outfit._id}>
                    <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-[10.5px] text-ivory-dim">{filterSummary(outfit.filters)}</span>
                        <span className="font-mono text-[10px] text-ivory-dim/60">
                            {new Date(outfit.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {outfit.items.map((item, i) => (
                            <OutfitCard key={i} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
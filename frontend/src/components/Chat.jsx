import { useState, useRef, useEffect } from "react";
import api from "../api";
import History from "./History";


const STYLE_OPTS = ["Casual", "Formal", "Ethnic", "Streetwear", "Minimal", "Bold"];
const OCCASION_OPTS = ["Office", "Date night", "Casual outing", "Wedding", "Party", "Brunch", "College", "Festive", "Travel"];
const WEATHER_OPTS = ["Hot & sunny", "Humid", "Mild", "Rainy", "Cold"];
const BUDGET_OPTS = ["Under ₹1,000", "₹1,000–₹3,000", "₹3,000–₹7,000", "₹7,000+"];

function ChipGroup({ label, options, value, onChange }) {
    return (
        <div>
            <span className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-gold-soft mb-2 block">{label}</span>
            <div className="flex flex-wrap gap-1.5">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => onChange(value === opt ? null : opt)}
                        className={`px-3.5 py-1.5 text-[12.5px] rounded-full border transition-all ${value === opt
                            ? "bg-gold border-gold text-ink font-semibold"
                            : "border-white/10 text-ivory-dim hover:border-gold-soft hover:text-ivory"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

function storeSearchLinks(query) {
    const q = encodeURIComponent(query);
    return {
        amazon: `https://www.amazon.in/s?k=${q}`,
        flipkart: `https://www.flipkart.com/search?q=${q}`,
        meesho: `https://www.meesho.com/search?q=${q}`,
        ajio: `https://www.ajio.com/search/?text=${q}`,
    };
}

function OutfitCard({ item }) {
    const links = storeSearchLinks(item.searchQuery || item.name);
    const priceText =
        item.priceMin && item.priceMax
            ? `≈ ₹${item.priceMin.toLocaleString("en-IN")} – ₹${item.priceMax.toLocaleString("en-IN")}`
            : "";
    return (
        <div className="relative bg-ink-2 border border-white/10 pl-5 pr-4 pt-4 pb-3.5 rounded-sm">
            <span className="absolute left-2 top-4 bottom-3.5 w-px bg-[repeating-linear-gradient(to_bottom,#8A7038_0_4px,transparent_4px_8px)]"></span>
            <span className="absolute left-1 top-3.5 w-1.5 h-1.5 rounded-full border border-gold-soft bg-ink-2"></span>
            <span className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-gold-soft">{item.category}</span>
            <div className="font-serif text-lg font-medium my-1">{item.name}</div>
            <div className="text-[12.5px] text-ivory-dim leading-relaxed mb-2.5">{item.description}</div>
            {priceText && <div className="font-mono text-xs mb-3">{priceText}</div>}
            <div className="grid grid-cols-4 gap-1.5">
                <a href={links.amazon} target="_blank" rel="noopener noreferrer" className="bg-ink border border-white/10 hover:border-[#FF9900] text-[10.5px] py-2 flex flex-col items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900]"></span>Amazon
                </a>
                <a href={links.flipkart} target="_blank" rel="noopener noreferrer" className="bg-ink border border-white/10 hover:border-[#2874F0] text-[10.5px] py-2 flex flex-col items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2874F0]"></span>Flipkart
                </a>
                <a href={links.meesho} target="_blank" rel="noopener noreferrer" className="bg-ink border border-white/10 hover:border-[#E8339E] text-[10.5px] py-2 flex flex-col items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8339E]"></span>Meesho
                </a>
                <a href={links.ajio} target="_blank" rel="noopener noreferrer" className="bg-ink border border-white/10 hover:border-[#D4AF37] text-[10.5px] py-2 flex flex-col items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>Ajio
                </a>
            </div>
        </div>
    );
}

export default function Chat({ token, user, onLogout }) {
    const [style, setStyle] = useState(null);
    const [occasion, setOccasion] = useState(null);
    const [weather, setWeather] = useState(null);
    const [budget, setBudget] = useState(null);
    const [notes, setNotes] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const [view, setView] = useState("chat");

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, loading]);

    const pickCount = [style, occasion, weather, budget].filter(Boolean).length;

    function summaryText() {
        const parts = [];
        if (style) parts.push(`Style: ${style}`);
        if (occasion) parts.push(`Occasion: ${occasion}`);
        if (weather) parts.push(`Weather: ${weather}`);
        if (budget) parts.push(`Budget: ${budget}`);
        if (notes) parts.push(`Notes: ${notes}`);
        return parts.length ? parts.join(" · ") : notes || "Surprise me with something stylish.";
    }

    async function handleSend() {
        if (!notes && pickCount === 0) return;
        const summary = summaryText();
        setMessages((m) => [...m, { role: "user", text: summary }]);
        setNotes("");
        setLoading(true);

        try {
            const res = await api.post(
                "/outfit/generate",
                { style, occasion, weather, budget, notes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages((m) => [...m, { role: "ai", intro: res.data.intro, items: res.data.items || [] }]);
        } catch (err) {
            setMessages((m) => [...m, { role: "ai", error: "I couldn't put that look together just now — try again in a moment." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex flex-col bg-ink">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4.5 py-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                    <span className="w-[26px] h-[26px] border border-gold rotate-45 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-gold -rotate-45"></span>
                    </span>
                    <span className="font-serif text-xl tracking-wide font-semibold">
                        VA<em className="text-gold not-italic italic">STRA</em>
                    </span>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => setView("chat")}
                        className={`text-[11px] tracking-wide uppercase px-3 py-1.5 border ${view === "chat" ? "border-gold text-gold" : "border-white/10 text-ivory-dim"}`}
                    >
                        Chat
                    </button>
                    <button
                        onClick={() => setView("history")}
                        className={`text-[11px] tracking-wide uppercase px-3 py-1.5 border ${view === "history" ? "border-gold text-gold" : "border-white/10 text-ivory-dim"}`}
                    >
                        History
                    </button>
                    <span className="font-mono text-[10.5px] text-ivory-dim tracking-wide">
                        HI, {user.name.split(" ")[0].toUpperCase()}
                    </span>
                    <button onClick={onLogout} className="border border-white/10 text-ivory-dim text-[11px] tracking-wide uppercase px-3 py-1.5 hover:border-gold hover:text-gold">
                        Log out
                    </button>
                </div>
            </div>

            {view === "history" ? (
                <History token={token} />
            ) : (
                <>
                    {/* Chat scroll */}

                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-5 pb-4 flex flex-col gap-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center text-center text-ivory-dim gap-2.5 px-8 pt-10 pb-6">
                                <span className="w-11 h-11 border border-gold-soft rotate-45 flex items-center justify-center mb-1.5">
                                    <span className="w-2.5 h-2.5 bg-gold-soft -rotate-45"></span>
                                </span>
                                <h3 className="font-serif text-lg text-ivory">Tell me what you're dressing for</h3>
                                <p className="text-[13px] max-w-xs leading-relaxed">
                                    Pick a vibe below or type your own words. I'll build the outfit and link every piece to where you can buy it.
                                </p>
                            </div>
                        )}

                        {messages.map((m, i) =>
                            m.role === "user" ? (
                                <div key={i} className="flex justify-end">
                                    <div className="max-w-[82%] bg-ink-3 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm px-4 py-3 text-sm">
                                        {m.text}
                                    </div>
                                </div>
                            ) : (
                                <div key={i} className="flex justify-start">
                                    <div className="w-full">
                                        <span className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-gold-soft mb-2.5 block">Vastra</span>
                                        {m.error ? (
                                            <p className="text-sm">{m.error}</p>
                                        ) : (
                                            <>
                                                <p className="text-[13.5px] text-ivory-dim mb-3">{m.intro}</p>
                                                <div className="italic font-serif text-gold text-[17px] mb-2">The look</div>
                                                <div className="flex flex-col gap-2.5">
                                                    {m.items.map((item, j) => (
                                                        <OutfitCard key={j} item={item} />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-1 py-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-soft animate-pulse"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-soft animate-pulse [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-soft animate-pulse [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick picks drawer */}
                    <button
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        className="flex items-center justify-between px-8 py-4 border-t border-white/10 bg-ink-2 text-[13px] tracking-wide uppercase text-ivory-dim"
                    >
                        <span>
                            Quick picks
                            {pickCount > 0 && (
                                <span className="bg-gold text-ink font-mono font-bold rounded-full px-1.5 py-0.5 text-[10px] ml-1.5">{pickCount}</span>
                            )}
                        </span>
                        <span className={`text-gold-soft transition-transform ${drawerOpen ? "rotate-180" : ""}`}>▾</span>
                    </button>
                    {drawerOpen && (
                        <div className="bg-ink-2 border-t border-white/10 max-h-72 overflow-y-auto px-8 py-5 flex flex-col gap-5">                            <ChipGroup label="Style" options={STYLE_OPTS} value={style} onChange={setStyle} />
                            <ChipGroup label="Occasion" options={OCCASION_OPTS} value={occasion} onChange={setOccasion} />
                            <ChipGroup label="Weather" options={WEATHER_OPTS} value={weather} onChange={setWeather} />
                            <ChipGroup label="Budget" options={BUDGET_OPTS} value={budget} onChange={setBudget} />
                        </div>
                    )}

                    {/* Composer */}
                    <div className="flex items-center gap-3 px-8 py-5 border-t border-white/10">                        <input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Add anything else — describe your style..."
                        className="flex-1 bg-ink-2 border border-white/10 rounded-full px-5 py-4 text-[15px] outline-none focus:border-gold-soft" />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="w-12 h-12 rounded-full bg-gold flex items-center justify-center disabled:opacity-40 shrink-0"                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="#14110F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>


    );
}
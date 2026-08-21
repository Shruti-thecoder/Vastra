function storeSearchLinks(query) {
    const q = encodeURIComponent(query);
    return {
        amazon: `https://www.amazon.in/s?k=${q}`,
        flipkart: `https://www.flipkart.com/search?q=${q}`,
        meesho: `https://www.meesho.com/search?q=${q}`,
        ajio: `https://www.ajio.com/search/?text=${q}`,
    };
}

export default function OutfitCard({ item }) {
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
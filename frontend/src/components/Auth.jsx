import { useState } from "react";
import api from "../api";

export default function Auth({ onLogin }) {
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        setError("");
        if (!email || !password || (!isLoginMode && !name)) {
            setError("Please fill in every field.");
            return;
        }
        setLoading(true);
        try {
            const endpoint = isLoginMode ? "/auth/login" : "/auth/signup";
            const payload = isLoginMode ? { email, password } : { name, email, password };
            const res = await api.post(endpoint, payload);
            onLogin(res.data.token, res.data.user);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center px-6 bg-ink">
            <div className="flex items-center gap-2.5 mb-2">
                <span className="w-6 h-6 border border-gold rotate-45 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-gold"></span>
                </span>
                <span className="font-serif text-xl tracking-wide font-semibold">
                    VA<em className="text-gold not-italic italic">STRA</em>
                </span>
            </div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold-soft mt-5 mb-1.5">
                AI STYLIST
            </p>
            <h1 className="font-serif text-3xl text-center max-w-xs mb-9 leading-tight">
                {isLoginMode ? (
                    <>Welcome <em className="text-gold italic">back</em>.</>
                ) : (
                    <>Dress the day <em className="text-gold italic">before</em> it happens.</>
                )}
            </h1>

            <div className="w-full max-w-sm flex flex-col gap-3.5">
                {!isLoginMode && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] tracking-wide uppercase text-ivory-dim">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="What should I call you?"
                            className="bg-ink-2 border border-white/10 text-ivory px-3.5 py-3 text-[15px] outline-none focus:border-gold"
                        />
                    </div>
                )}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] tracking-wide uppercase text-ivory-dim">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="bg-ink-2 border border-white/10 text-ivory px-3.5 py-3 text-[15px] outline-none focus:border-gold"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] tracking-wide uppercase text-ivory-dim">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-ink-2 border border-white/10 text-ivory px-3.5 py-3 text-[15px] outline-none focus:border-gold"
                    />
                </div>

                <div className="text-[12.5px] text-rose min-h-4">{error}</div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gold text-ink font-bold py-3.5 mt-1.5 disabled:opacity-50"
                >
                    {loading ? "..." : isLoginMode ? "Log in" : "Create account"}
                </button>

                <div className="text-center text-[13px] text-ivory-dim mt-4">
                    {isLoginMode ? "New here?" : "Already have an account?"}{" "}
                    <button
                        onClick={() => { setIsLoginMode(!isLoginMode); setError(""); }}
                        className="text-gold underline underline-offset-4"
                    >
                        {isLoginMode ? "Create an account" : "Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Bot } from "lucide-react";

interface Message {
    role: "USER" | "ASSISTANT";
    content: string;
}

export default function ChatWidget({ workspaceId }: { workspaceId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: "USER", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId,
                    messages: [...messages, userMsg].map(m => ({
                        role: m.role.toLowerCase(),
                        content: m.content
                    })),
                }),
            });

            const data = await res.json();
            if (data.content) {
                setMessages((prev) => [...prev, { role: "ASSISTANT", content: data.content }]);
            }
        } catch (error) {
            console.error("Widget chat error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-all hover:scale-110 active:scale-95"
                >
                    <MessageSquare className="h-6 w-6" />
                </button>
            ) : (
                <div className="flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
                        <div className="flex items-center space-x-3">
                            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="font-semibold">Support Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-blue-100 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium text-zinc-600">Hi! How can we help you today?</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === "USER"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-zinc-800 border border-zinc-100"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex space-x-1 rounded-2xl bg-white border border-zinc-100 px-4 py-3 shadow-sm">
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.3s]" />
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300 [animation-delay:-0.15s]" />
                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-300" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-zinc-100 p-4 bg-white">
                        <div className="flex items-center space-x-2 rounded-xl bg-zinc-100 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 bg-transparent text-sm text-zinc-800 placeholder-zinc-500 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="text-blue-600 hover:text-blue-500 disabled:text-zinc-400 transition-colors"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mt-3 text-center text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                            Powered by SupportIQ
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

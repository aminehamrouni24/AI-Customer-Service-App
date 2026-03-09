"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Globe, Shield, CreditCard, Save, Copy, Check, Loader2 } from "lucide-react";

interface Workspace {
    id: string;
    name: string;
    slug: string;
    apiKey: string;
    widgetConfig: {
        primaryColor: string;
        greeting: string;
        welcomeMessage: string;
    } | null;
}

export default function SettingsClient({ workspace }: { workspace: Workspace }) {
    const [name, setName] = useState(workspace.name);
    const [primaryColor, setPrimaryColor] = useState(workspace.widgetConfig?.primaryColor || "#3b82f6");
    const [greeting, setGreeting] = useState(workspace.widgetConfig?.greeting || "Hi there!");
    const [welcomeMessage, setWelcomeMessage] = useState(workspace.widgetConfig?.welcomeMessage || "How can we help you today?");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(workspace.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workspaceId: workspace.id,
                    name,
                    widgetConfig: {
                        primaryColor,
                        greeting,
                        welcomeMessage
                    }
                }),
            });

            if (res.ok) {
                // Show success toast or something?
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                <p className="mt-2 text-zinc-400">Configure your workspace and AI behavior.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white">General Settings</h2>
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-zinc-300">Workspace Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-zinc-300">Workspace Slug</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={workspace.slug}
                                    className="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-500 cursor-not-allowed italic"
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </section>

                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-white">API Keys</h2>
                        </div>
                        <p className="text-sm text-zinc-500">Use this key to authenticate your widget and API requests.</p>
                        <div className="mt-6 space-y-4">
                            <div className="relative group">
                                <input
                                    type="password"
                                    readOnly
                                    value={workspace.apiKey}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-white pr-24 font-mono text-sm tracking-wider"
                                />
                                <button
                                    onClick={handleCopy}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center space-x-1.5 rounded-md bg-zinc-800/80 px-2.5 py-1.5 text-xs font-semibold text-blue-500 hover:bg-zinc-700 transition-all border border-zinc-700 hover:border-blue-500/50"
                                >
                                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    <span>{copied ? "Copied" : "Copy"}</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white">Widget Configuration</h2>
                        <p className="mt-1 text-sm text-zinc-500">Customize how the chat widget looks to your users.</p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-zinc-300">Primary Color</label>
                                <div className="mt-2 flex items-center space-x-4">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="h-10 w-20 rounded border border-zinc-800 bg-zinc-950 p-1 cursor-pointer"
                                    />
                                    <span className="text-sm font-mono text-zinc-500 uppercase">{primaryColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-zinc-300">Greeting Message</label>
                                <input
                                    type="text"
                                    value={greeting}
                                    onChange={(e) => setGreeting(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-zinc-300">Welcome Message</label>
                                <input
                                    type="text"
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <nav className="flex flex-col space-y-1 hidden lg:flex">
                        {[
                            { name: "General", icon: SettingsIcon, current: true },
                            { name: "Widget", icon: Globe, current: false },
                            { name: "Security", icon: Shield, current: false },
                            { name: "Billing", icon: CreditCard, current: false },
                        ].map((item) => (
                            <button
                                key={item.name}
                                className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all group ${item.current
                                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent"
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${item.current ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

"use client";

import ChatWidget from "@/components/widget/chat-widget";
import { useSearchParams } from "next/navigation";

export default function WidgetTestPage() {
    const searchParams = useSearchParams();
    const workspaceId = searchParams.get("id");

    const isValidId = workspaceId && /^[0-9a-fA-F]{24}$/.test(workspaceId);

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-zinc-100 px-8 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <h1 className="text-xl font-bold text-zinc-900">SupportIQ Preview</h1>
                    {!isValidId && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                            No valid Workspace ID
                        </span>
                    )}
                </div>
            </nav>

            <main className="mx-auto max-w-4xl py-20 px-8 text-center sm:text-left">
                <h2 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
                    Welcome to your Demo Site
                </h2>
                <p className="mt-6 text-lg text-zinc-600 leading-relaxed max-w-2xl">
                    This is a sample page to test your SupportIQ chat widget. You should see a chat bubble in the bottom right corner.
                </p>

                {!isValidId ? (
                    <div className="mt-12 p-8 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900">
                        <h3 className="text-lg font-bold">Workspace ID Required</h3>
                        <p className="mt-2 text-amber-800">
                            To test the widget, you need to provide a valid workspace ID in the URL.
                            Please visit this page through the <strong>Widget Preview</strong> link in your dashboard.
                        </p>
                    </div>
                ) : (
                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        <div className="h-40 rounded-2xl bg-zinc-50 border border-zinc-100 p-6">
                            <h3 className="font-semibold text-zinc-900">AI Testing</h3>
                            <p className="mt-2 text-sm text-zinc-500">The widget below is connected to your knowledge base.</p>
                        </div>
                        <div className="h-40 rounded-2xl bg-zinc-50 border border-zinc-100 p-6">
                            <h3 className="font-semibold text-zinc-900">Embed Anywhere</h3>
                            <p className="mt-2 text-sm text-zinc-500">You can add this widget to any website using our snippet.</p>
                        </div>
                    </div>
                )}
            </main>

            {isValidId && <ChatWidget workspaceId={workspaceId} />}
        </div>
    );
}

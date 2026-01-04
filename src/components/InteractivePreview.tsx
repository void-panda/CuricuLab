"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";

const BEFORE_CONTENT = "Saya bekerja di PT Berkah Jaya sebagai staf admin. Tugas saya input data dan buat laporan bulanan.";
const AFTER_CONTENT = "Professional Administrative Staff dengan pengalaman dalam optimasi manajemen data dan pelaporan strategis. Meningkatkan efisiensi input data sebesar 20% melalui implementasi sistem tracking terintegrasi.";

const TypewriterText = ({ text }: { text: string }) => {
    const words = text.split(" ");
    return (
        <motion.div className="flex flex-wrap gap-x-1 gap-y-1">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="inline-block"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export const InteractivePreview = () => {
    const [isOptimized, setIsOptimized] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleOptimize = () => {
        if (!isOptimized) {
            setIsTyping(true);
            setIsOptimized(true);
        } else {
            setIsOptimized(false);
            setIsTyping(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="relative border-4 border-black bg-white dark:bg-zinc-900 p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-4">
                    <div className="flex gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-black bg-red-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                        <div className="h-4 w-4 rounded-full border-2 border-black bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                        <div className="h-4 w-4 rounded-full border-2 border-black bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                    </div>
                    <div className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-500">
                        curiculab_ai_v1.exe
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="font-mono text-xs font-black uppercase text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 border-2 border-black">Original Input</label>
                        </div>
                        <div className="h-40 border-4 border-black bg-zinc-50 dark:bg-zinc-800 p-4 font-mono text-sm text-zinc-600 dark:text-zinc-400 shadow-[inner_4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            {BEFORE_CONTENT}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="font-mono text-xs font-black uppercase text-white bg-orange-500 px-2 py-1 border-2 border-black">AI Output</label>
                        </div>
                        <motion.div
                            className="h-40 border-4 border-black bg-orange-50 dark:bg-orange-950/20 p-4 font-mono text-sm font-bold overflow-y-auto custom-scrollbar"
                            initial={false}
                            animate={{ borderColor: isOptimized ? "#f97316" : "rgba(0,0,0,0.1)" }}
                        >
                            {isOptimized ? (
                                <TypewriterText text={AFTER_CONTENT} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-400/50 italic space-y-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
                                    <span>Standby for optimization...</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleOptimize}
                        className="h-16 border-4 border-black px-12 text-xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all bg-orange-500 text-white group"
                    >
                        {isOptimized ? "RESET SYSTEM" : (
                            <span className="flex items-center gap-2">
                                OPTIMASI DENGAN AI
                                <span className="group-hover:rotate-12 transition-transform inline-block">✨</span>
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

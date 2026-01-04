"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const BackgroundEffect = () => {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 10 + 5,
            duration: Math.random() * 20 + 10,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden overflow-y-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute bg-black/5 dark:bg-white/5"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        border: "2px solid rgba(0,0,0,0.1)",
                    }}
                    animate={{
                        y: [0, 1000],
                        rotate: [0, 360],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: -Math.random() * 20,
                    }}
                />
            ))}
        </div>
    );
};

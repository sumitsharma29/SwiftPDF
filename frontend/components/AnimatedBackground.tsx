'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1]
                }}
                style={{ willChange: "transform, opacity" }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.25, 0.1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                    delay: 2
                }}
                style={{ willChange: "transform, opacity" }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ willChange: "transform" }}
                className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[90px]"
            />
        </div>
    );
}

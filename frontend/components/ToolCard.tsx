'use client';

import Link from 'next/link';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { MouseEvent, useRef } from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  index: number;
}

export default function ToolCard({ title, description, icon: Icon, href, color, index }: ToolCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  function onMouseLeave() {
    // Instead of snapping to 0, we let the spotlight fade out naturally
    // via the opacity transition in the CSS/Motion div
  }

  const spotlightColor = color.includes('cyan') ? 'rgba(6, 182, 212, 0.15)' : 
                         color.includes('red') ? 'rgba(239, 68, 68, 0.15)' :
                         color.includes('orange') ? 'rgba(249, 115, 22, 0.15)' :
                         color.includes('yellow') ? 'rgba(234, 179, 8, 0.15)' :
                         color.includes('green') || color.includes('emerald') ? 'rgba(16, 185, 129, 0.15)' :
                         color.includes('teal') ? 'rgba(20, 184, 166, 0.15)' :
                         color.includes('blue') ? 'rgba(59, 130, 246, 0.15)' :
                         color.includes('purple') ? 'rgba(168, 85, 247, 0.15)' :
                         color.includes('rose') || color.includes('pink') ? 'rgba(244, 63, 94, 0.15)' :
                         color.includes('indigo') ? 'rgba(99, 102, 241, 0.15)' :
                         'rgba(255, 255, 255, 0.08)';

  return (
    <Link href={href} className="block group/link">
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.03, 
          ease: [0.23, 1, 0.32, 1] 
        }}
        whileHover={{ 
          y: -5, 
          scale: 1.02,
          transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } 
        }}
        whileTap={{ scale: 0.98 }}
        className="relative glass-panel rounded-[2rem] p-8 h-full overflow-hidden flex flex-col justify-between border-beam will-change-transform"
      >
        {/* Spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover/link:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                450px circle at ${mouseXSpring}px ${mouseYSpring}px,
                ${spotlightColor},
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} relative group-hover/link:scale-110 transition-transform duration-700 ease-[0.23, 1, 0.32, 1]`}>
              <div className="absolute inset-0 blur-xl opacity-40 group-hover/link:opacity-100 transition-opacity bg-inherit rounded-inherit" />
              <Icon className="w-6 h-6 text-white relative z-10" />
            </div>
            <ArrowUpRight className="text-gray-600 group-hover/link:text-white group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all duration-300" size={20} />
          </div>

          <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover/link:text-cyan-400 transition-colors duration-300">
            {title}
          </h3>

          <p className="text-gray-500 group-hover/link:text-gray-300 transition-colors duration-300 text-sm font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-pulse-slow" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover/link:text-gray-400 transition-colors duration-300">Enterprise Ready</span>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}


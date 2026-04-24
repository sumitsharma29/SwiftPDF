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

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const mouseX = clientX - left;
    const mouseY = clientY - top;
    x.set(mouseX);
    y.set(mouseY);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const spotlightColor = color.includes('cyan') ? 'rgba(6, 182, 212, 0.1)' : 
                         color.includes('red') ? 'rgba(239, 68, 68, 0.1)' :
                         color.includes('orange') ? 'rgba(249, 115, 22, 0.1)' :
                         color.includes('yellow') ? 'rgba(234, 179, 8, 0.1)' :
                         color.includes('green') || color.includes('emerald') ? 'rgba(16, 185, 129, 0.1)' :
                         color.includes('teal') ? 'rgba(20, 184, 166, 0.1)' :
                         color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' :
                         color.includes('purple') ? 'rgba(168, 85, 247, 0.1)' :
                         color.includes('rose') || color.includes('pink') ? 'rgba(244, 63, 94, 0.1)' :
                         color.includes('indigo') ? 'rgba(99, 102, 241, 0.1)' :
                         'rgba(255, 255, 255, 0.05)';

  return (
    <Link href={href} className="block group/link">
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -10 }}
        className="relative glass-panel rounded-[2rem] p-8 h-full transition-all duration-500 overflow-hidden flex flex-col justify-between border-beam"
      >
        {/* Spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-500 group-hover/link:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseXSpring}px ${mouseYSpring}px,
                ${spotlightColor},
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} relative group-hover/link:scale-110 transition-transform duration-500`}>
              <div className="absolute inset-0 blur-xl opacity-40 group-hover/link:opacity-100 transition-opacity bg-inherit rounded-inherit" />
              <Icon className="w-6 h-6 text-white relative z-10" />
            </div>
            <ArrowUpRight className="text-gray-600 group-hover/link:text-white group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" size={20} />
          </div>

          <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover/link:text-cyan-400 transition-colors">
            {title}
          </h3>

          <p className="text-gray-500 group-hover/link:text-gray-300 transition-colors text-sm font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Enterprise Ready</span>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}


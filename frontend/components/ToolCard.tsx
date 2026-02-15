'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  index: number;
}

export default function ToolCard({ title, description, icon: Icon, href, color, index }: ToolCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="glass rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 hover:shadow-2xl hover:border-blue-200 group relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} p-4 text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <Icon className="w-full h-full" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors font-heading">
          {title}
        </h3>

        <p className="text-gray-600 font-medium leading-relaxed">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const tools = [
    { name: 'Merge PDF', href: '/tools/merge', color: 'text-red-600' },
    { name: 'Split PDF', href: '/tools/split', color: 'text-orange-600' },
    { name: 'Organize PDF', href: '/tools/organize', color: 'text-yellow-600' },
    { name: 'Compress PDF', href: '/tools/compress', color: 'text-green-600' },
    { name: 'PDF to JPG', href: '/tools/pdf-to-jpg', color: 'text-teal-600' },
    { name: 'JPG to PDF', href: '/tools/jpg-to-pdf', color: 'text-blue-600' },
    { name: 'Lock PDF', href: '/tools/lock', color: 'text-indigo-600' },
    { name: 'Unlock PDF', href: '/tools/unlock', color: 'text-purple-600' },
    { name: 'Watermark', href: '/tools/watermark', color: 'text-pink-600' },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 font-sans">
            <div className="max-w-7xl mx-auto glass rounded-2xl sm:rounded-full px-4 py-3 sm:px-8 sm:py-4 flex items-center justify-between shadow-lg sm:shadow-2xl border border-white/60 backdrop-blur-xl relative">
                <Link href="/" className="flex items-center space-x-2 sm:space-x-3 text-gray-900 hover:opacity-80 transition-opacity z-50">
                    <div className="bg-gradient-to-tr from-blue-100 to-violet-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-inner">
                        <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">SwiftPDF</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <div className="relative group">
                        <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-semibold transition-colors text-sm uppercase tracking-wider py-2">
                            <span>Tools</span>
                            <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                        </button>

                        <div className="absolute top-full right-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                            <div className="glass rounded-xl shadow-xl border border-white/50 overflow-hidden p-2 bg-white/90 backdrop-blur-xl">
                                <div className="grid gap-1">
                                    {tools.map((tool) => (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-700 flex items-center"
                                        >
                                            <span className={`w-2 h-2 rounded-full mr-3 ${tool.color.replace('text-', 'bg-')}`}></span>
                                            {tool.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-50 active:scale-95"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 p-2 md:hidden"
                        >
                            <div className="glass rounded-2xl shadow-2xl border border-white/60 bg-white/95 backdrop-blur-xl overflow-hidden p-2 max-h-[75vh] overflow-y-auto">
                                <div className="grid gap-1">
                                    <p className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest sticky top-0 bg-white/95 backdrop-blur-xl z-10 border-b border-gray-100 mb-1">Select Tool</p>
                                    {tools.map((tool) => (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center px-4 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-gray-700 font-medium group"
                                        >
                                            <span className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors shadow-sm`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${tool.color.replace('text-', 'bg-')}`}></span>
                                            </span>
                                            <span className="text-base text-gray-900">{tool.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

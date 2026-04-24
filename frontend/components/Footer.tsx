'use client';

import { Github, Linkedin, Instagram, Heart, Globe, Shield, Zap, Cpu, Code, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden bg-black/40 backdrop-blur-3xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-white mb-6 block">
                        Swift<span className="text-cyan-500">PDF</span>
                    </Link>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8 font-medium">
                        The world&apos;s most advanced PDF intelligence suite. Engineered for speed, security, and precision. All document processing happens in isolated ephemeral sessions for absolute privacy.
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://github.com/sumitsharma29" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                            <Github size={18} />
                        </a>
                        <a href="https://www.linkedin.com/in/sumit-sharma-78b93b294" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                            <Linkedin size={18} />
                        </a>
                        <a href="https://www.instagram.com/sumit__sharma__29" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                            <Instagram size={18} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Product</h4>
                    <ul className="space-y-4">
                        {[
                            { name: 'Features', icon: Zap, href: '/#tools' },
                            { name: 'Security', icon: Shield, href: '/about' },
                            { name: 'Enterprise', icon: Cpu, href: '#' },
                            { name: 'API', icon: Code, href: '/api/docs' }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-gray-500 hover:text-cyan-400 text-sm font-bold transition-all flex items-center gap-2">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Company</h4>
                    <ul className="space-y-4">
                        {[
                            { name: 'About', icon: BookOpen, href: '/about' },
                            { name: 'Privacy', icon: Shield, href: '#' },
                            { name: 'Terms', icon: Globe, href: '#' },
                            { name: 'Contact', icon: Globe, href: '#' }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-gray-500 hover:text-cyan-400 text-sm font-bold transition-all flex items-center gap-2">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col justify-center items-center gap-6">
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    &copy; {new Date().getFullYear()} SwiftPDF Labs. All rights reserved.
                </p>
                <div className="flex flex-col items-center gap-2 text-gray-500 text-xs font-bold">
                    <div className="flex items-center space-x-2">
                        <span>Engineered with</span>
                        <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
                        <span>by</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Sumit Sharma</span>
                </div>
            </div>
        </footer>
    );
}



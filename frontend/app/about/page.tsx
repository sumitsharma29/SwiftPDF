'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Sparkles, Cpu, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#020202]">
            <Navbar />

            <main className="flex-grow pt-40 px-4 pb-24 w-full max-w-6xl mx-auto relative">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="text-center mb-20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 py-1 px-4 rounded-full glass-panel border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                        >
                            <Sparkles size={12} />
                            The Mission
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                            Architecting <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Precision</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            SwiftPDF was engineered to redefine document intelligence. We provide professionals with absolute control over their PDF workflows through elite-level algorithms and unyielding security.
                        </p>
                    </div>

                    <div className="glass-panel p-1 md:p-1 rounded-[3rem] border border-white/5 overflow-hidden mb-20">
                        <div className="bg-[#050505]/80 backdrop-blur-3xl p-10 md:p-20 rounded-[2.9rem] space-y-16">
                            <div className="grid md:grid-cols-3 gap-12">
                                {[
                                    { 
                                        icon: Zap, 
                                        title: 'Neural Speed', 
                                        desc: 'Processed instantly using highly optimized Python processing cores.',
                                        color: 'text-cyan-400',
                                        bg: 'bg-cyan-500/10'
                                    },
                                    { 
                                        icon: Shield, 
                                        title: 'Ephemeral Flow', 
                                        desc: 'Documents are processed in isolated memory sessions and purged instantly.',
                                        color: 'text-purple-400',
                                        bg: 'bg-purple-500/10'
                                    },
                                    { 
                                        icon: Heart, 
                                        title: 'Open Access', 
                                        desc: 'Premium intelligence tools available to everyone without restrictions.',
                                        color: 'text-rose-400',
                                        bg: 'bg-rose-500/10'
                                    }
                                ].map((feature, i) => (
                                    <div key={i} className="space-y-6">
                                        <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                            <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white tracking-tight uppercase">{feature.title}</h3>
                                        <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-16 border-t border-white/5 grid md:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Our Ecosystem</h2>
                                        <p className="text-gray-400 font-medium leading-relaxed">
                                            SwiftPDF leverages a sophisticated tech stack combining the raw processing power of <span className="text-white">FastAPI</span> with the fluid interactivity of <span className="text-white">Next.js 15+</span>.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {['FastAPI', 'Next.js', 'PyMuPDF', 'Pikepdf', 'Tailwind'].map((tech) => (
                                            <span key={tech} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
                                        <Cpu className="text-cyan-400 mb-4" size={32} />
                                        <p className="text-white font-black text-2xl tracking-tighter">100%</p>
                                        <p className="text-cyan-400/60 text-[10px] font-black uppercase tracking-widest">Local Processing</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/20">
                                        <Globe className="text-purple-400 mb-4" size={32} />
                                        <p className="text-white font-black text-2xl tracking-tighter">∞ Free</p>
                                        <p className="text-purple-400/60 text-[10px] font-black uppercase tracking-widest">Global Accessibility</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}


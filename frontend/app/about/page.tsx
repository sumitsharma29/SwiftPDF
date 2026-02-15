'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 px-4 pb-12 w-full max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center font-heading">
                        About <span className="text-blue-600">SwiftPDF</span>
                    </h1>

                    <div className="glass p-8 md:p-12 rounded-3xl shadow-xl space-y-8 text-lg text-gray-700 leading-relaxed">
                        <p>
                            SwiftPDF was built with a simple mission: to make PDF tools **accessible, fast, and secure** for everyone.
                            We believe that basic document manipulation shouldn't require expensive software or subscriptions.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Lightning Fast</h3>
                                <p className="text-base text-gray-600">Processed instantly using optimized algorithms.</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto text-green-600">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">100% Secure</h3>
                                <p className="text-base text-gray-600">Files are processed in isolated sessions and deleted automatically.</p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Completely Free</h3>
                                <p className="text-base text-gray-600">No hidden fees, no watermarks, no limits.</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Technology</h2>
                            <p>
                                SwiftPDF relies on a robust **FastAPI** backend for heavy-duty processing and a modern **Next.js** frontend for a smooth user experience.
                                We use industry-standard libraries like `pypdf`, `reportlab`, and `img2pdf` to ensure your documents are handled with care.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}

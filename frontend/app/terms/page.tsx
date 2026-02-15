'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 px-4 pb-12 w-full max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 font-heading">Terms of Service</h1>

                <div className="glass p-8 md:p-12 rounded-3xl shadow-xl prose prose-blue max-w-none text-gray-700">
                    <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using SwiftPDF, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>

                    <h3>2. Usage License</h3>
                    <p>
                        Permission is granted to temporarily use the materials (information or software) on SwiftPDF's website for personal, non-commercial transitory viewing only.
                    </p>

                    <h3>3. Disclaimer</h3>
                    <p>
                        The materials on SwiftPDF's website are provided "as is". SwiftPDF makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                    </p>

                    <h3>4. Limitations</h3>
                    <p>
                        In no event shall SwiftPDF or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SwiftPDF's Internet site.
                    </p>

                    <h3>5. Governing Law</h3>
                    <p>
                        Any claim relating to SwiftPDF's website shall be governed by the laws of the State of India without regard to its conflict of law provisions.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}

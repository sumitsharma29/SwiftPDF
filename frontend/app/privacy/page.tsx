'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 px-4 pb-12 w-full max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 font-heading">Privacy Policy</h1>

                <div className="glass p-8 md:p-12 rounded-3xl shadow-xl prose prose-blue max-w-none text-gray-700">
                    <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Data Collection</h3>
                    <p>
                        We do not collect any personal data. We do not require you to create an account or provide your email address to use our tools.
                    </p>

                    <h3>2. File Handling</h3>
                    <p>
                        When you upload a file to SwiftPDF, it is temporarily saved on our secure processing server.
                        <strong> Your files are automatically deleted</strong> after 30 minutes or immediately after processing failures.
                        We do not look at, copy, or share your documents.
                    </p>

                    <h3>3. Cookies</h3>
                    <p>
                        We use minimal local storage to remember your theme preferences. We do not use third-party tracking cookies.
                    </p>

                    <h3>4. Security</h3>
                    <p>
                        We employ industry-standard security measures, including HTTPS encryption and server-side file isolation, to protect your data during transit and processing.
                    </p>

                    <h3>5. Contact</h3>
                    <p>
                        If you have questions about this policy, please contact us.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}

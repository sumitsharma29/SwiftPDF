'use client';

import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="w-12 h-12 text-red-500" />
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Oops! It seems like the page you are looking for has been moved or doesn't exist.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Back Home
                </Link>
            </div>
        </div>
    );
}

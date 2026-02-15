export default function Footer() {
    return (
        <footer className="w-full py-8 mt-12 text-center text-gray-700 text-sm font-medium">
            <p className="mb-2 flex items-center justify-center gap-1">
                Made with <span className="text-red-500 animate-pulse">❤️</span> by <span className="font-bold text-gray-900">Sumit Sharma</span>
            </p>
            <p>&copy; {new Date().getFullYear()} SwiftPDF. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
                <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
                <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-blue-600 transition-colors">Terms</a>
            </div>
        </footer>
    );
}

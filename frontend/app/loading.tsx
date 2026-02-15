export default function Loading() {
    return (
        <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto">
            {/* Hero Skeleton */}
            <div className="flex flex-col items-center mb-20 space-y-6 animate-pulse">
                <div className="w-48 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-3/4 h-24 bg-gray-200 rounded-3xl"></div>
                <div className="w-1/2 h-12 bg-gray-200 rounded-xl"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
                ))}
            </div>
        </div>
    );
}

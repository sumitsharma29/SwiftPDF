import { notFound } from 'next/navigation';
import ToolInterface from '@/components/ToolInterface';

export function generateStaticParams() {
    return [
        { tool: 'merge' },
        { tool: 'split' },
        { tool: 'organize' },
        { tool: 'compress' },
        { tool: 'pdf-to-jpg' },
        { tool: 'jpg-to-pdf' },
        { tool: 'lock' },
        { tool: 'unlock' },
        { tool: 'watermark' },
    ];
}

export default async function ToolPage(props: { params: Promise<{ tool: string }> }) {
    const params = await props.params;
    const allowedTools = [
        'merge', 'split', 'organize', 'compress',
        'pdf-to-jpg', 'jpg-to-pdf', 'lock', 'unlock', 'watermark'
    ];

    if (!allowedTools.includes(params.tool)) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <ToolInterface tool={params.tool} />
            </div>
        </div>
    );
}

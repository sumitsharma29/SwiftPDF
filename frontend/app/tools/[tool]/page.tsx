import { notFound } from 'next/navigation';
import ToolInterface from '@/components/ToolInterface';
import AnimatedBackground from '@/components/AnimatedBackground';

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
        { tool: 'extract-text' },
        { tool: 'repair' },
        { tool: 'edit-metadata' },
        { tool: 'add-page-numbers' },
    ];
}

export default async function ToolPage(props: { params: Promise<{ tool: string }> }) {
    const params = await props.params;
    const allowedTools = [
        'merge', 'split', 'organize', 'compress',
        'pdf-to-jpg', 'jpg-to-pdf', 'lock', 'unlock', 'watermark',
        'extract-text', 'repair', 'edit-metadata', 'add-page-numbers'
    ];

    if (!allowedTools.includes(params.tool)) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#020202] text-gray-100 relative overflow-hidden">
            <AnimatedBackground />
            <div className="relative z-10">
                <ToolInterface tool={params.tool} />
            </div>
        </div>
    );
}


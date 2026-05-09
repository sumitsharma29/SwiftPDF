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
        { tool: 'sign' },
        { tool: 'redact' },
        { tool: 'compare' },
        { tool: 'word-to-pdf' },
        { tool: 'excel-to-pdf' },
        { tool: 'ppt-to-pdf' },
        { tool: 'html-to-pdf' },
        { tool: 'pdf-to-word' },
        { tool: 'remove-pages' },
        { tool: 'extract-pages' },
        { tool: 'scan-to-pdf' },
        { tool: 'rotate-pdf' },
        { tool: 'crop-pdf' },
        { tool: 'psd-to-pdf' },
        { tool: 'tiff-to-pdf' },
        { tool: 'pdf-to-tiff' },
        { tool: 'json-to-pdf' },
        { tool: 'xml-to-pdf' },
        { tool: 'yaml-to-pdf' },
        { tool: 'pdf-to-json' },
        { tool: 'ocr' },
        { tool: 'remove-bg' },
        { tool: 'pdf-to-pdfa' },
        { tool: 'base64-to-pdf' },
        { tool: 'editor' },
    ];
}

export default async function ToolPage(props: { params: Promise<{ tool: string }> }) {
    const params = await props.params;
    const allowedTools = [
        'merge', 'split', 'organize', 'compress',
        'pdf-to-jpg', 'jpg-to-pdf', 'lock', 'unlock', 'watermark',
        'extract-text', 'repair', 'edit-metadata', 'add-page-numbers',
        'sign', 'redact', 'compare',
        'word-to-pdf', 'excel-to-pdf', 'ppt-to-pdf', 'html-to-pdf',
        'pdf-to-word', 'remove-pages', 'extract-pages', 'scan-to-pdf',
        'rotate-pdf', 'crop-pdf', 'psd-to-pdf', 'tiff-to-pdf', 'pdf-to-tiff',
        'json-to-pdf', 'xml-to-pdf', 'yaml-to-pdf', 'pdf-to-json',
        'ocr', 'remove-bg', 'pdf-to-pdfa', 'base64-to-pdf', 'editor'
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


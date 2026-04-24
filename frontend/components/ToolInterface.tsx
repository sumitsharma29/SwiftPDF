'use client';

import { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Loader2, 
    Download, 
    File as FileIcon, 
    X, 
    UploadCloud, 
    CheckCircle2, 
    Zap,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import PDFOrganizer from '@/components/PDFOrganizer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

interface ToolInterfaceProps {
    tool: string;
}

export default function ToolInterface({ tool }: ToolInterfaceProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState<any>({ level: 'medium' });
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [compareReport, setCompareReport] = useState<any>(null);
    
    const { addToast } = useToast();

    const toolConfig: any = {
        merge: { title: 'Merge PDF', description: 'Consolidate multiple documents into a single authoritative file.', multiple: true, endpoint: `${API_BASE}/api/process/merge`, color: 'text-red-400', gradient: 'from-red-500/20 to-orange-500/20', accent: 'bg-red-500' },
        split: { title: 'Split PDF', description: 'Deconstruct documents with surgical page extraction.', multiple: false, endpoint: `${API_BASE}/api/process/split`, color: 'text-orange-400', gradient: 'from-orange-500/20 to-yellow-500/20', accent: 'bg-orange-500' },
        organize: { title: 'Organize PDF', description: 'Architect your document flow with total page control.', multiple: false, endpoint: `${API_BASE}/api/process/organize`, color: 'text-yellow-400', gradient: 'from-yellow-400/20 to-orange-400/20', accent: 'bg-yellow-500' },
        compress: { title: 'Compress PDF', description: 'Optimize storage through intelligent asset reduction.', multiple: false, endpoint: `${API_BASE}/api/process/compress`, color: 'text-emerald-400', gradient: 'from-green-500/20 to-emerald-500/20', accent: 'bg-emerald-500' },
        'pdf-to-jpg': { title: 'PDF to JPG', description: 'Decompose PDF pages into high-fidelity raster assets.', multiple: false, endpoint: `${API_BASE}/api/process/pdf-to-jpg`, color: 'text-teal-400', gradient: 'from-teal-500/20 to-cyan-500/20', accent: 'bg-teal-500' },
        'jpg-to-pdf': { title: 'JPG to PDF', description: 'Assemble high-resolution images into standardized PDF format.', multiple: true, endpoint: `${API_BASE}/api/process/jpg-to-pdf`, accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }, color: 'text-blue-400', gradient: 'from-blue-500/20 to-indigo-500/20', accent: 'bg-blue-500' },
        lock: { title: 'Lock PDF', description: 'Enforce military-grade encryption for sensitive data.', multiple: false, endpoint: `${API_BASE}/api/process/lock`, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-purple-500/20', accent: 'bg-indigo-500' },
        unlock: { title: 'Unlock PDF', description: 'Remove security credentials from authorized documents.', multiple: false, endpoint: `${API_BASE}/api/process/unlock`, color: 'text-purple-400', gradient: 'from-purple-500/20 to-pink-500/20', accent: 'bg-purple-500' },
        watermark: { title: 'Watermark PDF', description: 'Brand documents with secure identity markers.', multiple: false, endpoint: `${API_BASE}/api/process/watermark`, color: 'text-pink-400', gradient: 'from-pink-500/20 to-rose-500/20', accent: 'bg-pink-500' },
        'extract-text': { title: 'Extract Text', description: 'Harvest semantic content using advanced OCR engines.', multiple: false, endpoint: `${API_BASE}/api/process/extract-text`, color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-blue-500/20', accent: 'bg-cyan-500', isText: true },
        'repair': { title: 'Repair PDF', description: 'Restore structural integrity to damaged PDF sources.', multiple: false, endpoint: `${API_BASE}/api/process/repair`, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/20', accent: 'bg-emerald-500' },
        'edit-metadata': { title: 'Edit Metadata', description: 'Control internal document properties and indexing.', multiple: false, endpoint: `${API_BASE}/api/process/edit-metadata`, color: 'text-slate-400', gradient: 'from-slate-500/20 to-gray-600/20', accent: 'bg-slate-500' },
        'add-page-numbers': { title: 'Page Numbers', description: 'Implement dynamic, sequential indexing protocols.', multiple: false, endpoint: `${API_BASE}/api/process/add-page-numbers`, color: 'text-blue-400', gradient: 'from-blue-700/20 to-indigo-800/20', accent: 'bg-blue-600' },
        'sign': { title: 'Sign PDF', description: 'Authenticate documents with professional signature overlays.', multiple: false, endpoint: `${API_BASE}/api/process/sign`, color: 'text-purple-400', gradient: 'from-purple-500/20 to-fuchsia-600/20', accent: 'bg-purple-500' },
        'redact': { title: 'Redact PDF', description: 'Permanently obscure sensitive data with absolute certainty.', multiple: false, endpoint: `${API_BASE}/api/process/redact`, color: 'text-rose-400', gradient: 'from-rose-500/20 to-red-600/20', accent: 'bg-rose-500' },
        'compare': { title: 'Compare PDF', description: 'Execute deep structural analysis between two documents.', multiple: true, endpoint: `${API_BASE}/api/process/compare`, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-violet-600/20', accent: 'bg-indigo-500', isReport: true },
    };

    const config = toolConfig[tool] || toolConfig.merge;

    const onDrop = (acceptedFiles: File[]) => {
        if (tool === 'compare' && files.length + acceptedFiles.length > 2) {
            addToast('Comparison requires exactly 2 documents.', 'error');
            return;
        }
        setFiles(config.multiple ? [...files, ...acceptedFiles] : [acceptedFiles[0]]);
        setDownloadUrl(null);
        setError(null);
        addToast(`${acceptedFiles.length} file${acceptedFiles.length > 1 ? 's' : ''} added`, 'info');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: config.accept || { 'application/pdf': ['.pdf'] },
        multiple: config.multiple,
    });

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            addToast('Upload source files to proceed.', 'error');
            return;
        }
        if (tool === 'compare' && files.length !== 2) {
            addToast('Select two documents for comparison.', 'error');
            return;
        }

        setLoading(true);
        setError(null);
        setDownloadUrl(null);
        setExtractedText(null);
        setCompareReport(null);

        const formData = new FormData();
        if (tool === 'compare') {
            formData.append('file1', files[0]);
            formData.append('file2', files[1]);
        } else {
            files.forEach((file) => formData.append(config.multiple ? 'files' : 'file', file));
        }

        Object.keys(settings).forEach(key => {
            if (settings[key]) formData.append(key, settings[key]);
        });

        try {
            const response = await axios.post(config.endpoint, formData, {
                responseType: (config.isText || config.isReport) ? 'json' : 'blob',
            });

            if (config.isText) {
                setExtractedText(response.data.text);
                addToast('Extraction complete.', 'success');
            } else if (config.isReport) {
                setCompareReport(response.data.report);
                addToast('Comparison complete.', 'success');
            } else {
                const contentType = response.headers['content-type'];
                let ext = 'pdf';
                if (contentType === 'application/zip') ext = 'zip';
                if (contentType === 'image/jpeg') ext = 'jpg';

                const url = window.URL.createObjectURL(new Blob([response.data]));
                setDownloadUrl(url);
                setSettings({ ...settings, _downloadExt: ext });
                addToast('Operation successful.', 'success');
            }
        } catch (err: any) {
            console.error('Processing Error:', err);
            let msg = 'Operation failed. Verify document integrity.';
            if (err.response?.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const json = JSON.parse(reader.result as string);
                        addToast(json.detail || msg, 'error');
                    } catch (e) {
                        addToast(msg, 'error');
                    }
                };
                reader.readAsText(err.response.data);
            } else {
                msg = err.response?.data?.detail || err.message || msg;
                addToast(msg, 'error');
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen py-20 px-4 max-w-6xl mx-auto flex flex-col relative z-20">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-white transition-all mb-10 group font-bold uppercase tracking-widest text-xs">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to SwiftPDF Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 space-y-8"
                >
                    <div className="space-y-4">
                        <h1 className={`text-4xl md:text-6xl font-black tracking-tighter ${config.color}`}>
                            {config.title}
                        </h1>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                            {config.description}
                        </p>
                    </div>

                    <div className="glass-panel rounded-3xl p-8 space-y-8 border border-white/5">
                        <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                            Operation Parameters
                        </h3>

                        <div className="space-y-6">
                            {tool === 'split' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Page Sequence (e.g. 1-5, 8)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-bold"
                                        placeholder="1-5, 10"
                                        onChange={(e) => setSettings({ ...settings, page_range: e.target.value })}
                                    />
                                </div>
                            )}
                            {tool === 'compress' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Compression Level</label>
                                    <select
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-bold appearance-none"
                                        onChange={(e) => setSettings({ ...settings, level: e.target.value })}
                                        defaultValue="medium"
                                    >
                                        <option value="low">Optimized (Quality Priority)</option>
                                        <option value="medium">Standard (Balanced)</option>
                                        <option value="high">Maximized (Size Priority)</option>
                                    </select>
                                </div>
                            )}
                            {(tool === 'lock' || tool === 'unlock') && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Access Credential</label>
                                    <input
                                        type="password"
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-bold"
                                        placeholder="••••••••"
                                        onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                                    />
                                </div>
                            )}
                            {tool === 'watermark' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Identity Marker Text</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-bold"
                                        placeholder="INTERNAL USE ONLY"
                                        onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                                    />
                                </div>
                            )}
                            {tool === 'sign' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Authentication Text</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-bold"
                                        placeholder="E-Signed by [Name]"
                                        onChange={(e) => setSettings({ ...settings, signature_text: e.target.value })}
                                    />
                                </div>
                            )}
                            {tool === 'redact' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Text to Obscure</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-bold"
                                        placeholder="SSN, Phone, etc."
                                        onChange={(e) => setSettings({ ...settings, search_text: e.target.value })}
                                    />
                                </div>
                            )}
                            {tool === 'edit-metadata' && (
                                <div className="grid gap-4">
                                    {['Title', 'Author', 'Subject', 'Keywords'].map((field) => (
                                        <div key={field} className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{field}</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-all font-bold"
                                                placeholder={`Specify ${field}`}
                                                onChange={(e) => setSettings({ ...settings, [field.toLowerCase()]: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {!['split', 'organize', 'compress', 'lock', 'unlock', 'watermark', 'edit-metadata', 'sign', 'redact'].includes(tool) && (
                                <p className="text-gray-500 text-sm font-bold italic">Automatic execution protocol active.</p>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || files.length === 0}
                            className={`
                                w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3
                                ${loading ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-cyan-500 hover:text-white shadow-2xl active:scale-[0.98]'}
                            `}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            {loading ? 'Executing Operation...' : `Initiate ${config.title}`}
                        </button>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7"
                >
                    <AnimatePresence mode="wait">
                        {!downloadUrl && !extractedText && !compareReport && (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full"
                            >
                                <div
                                    {...getRootProps()}
                                    className={`
                                        relative h-full min-h-[400px] rounded-[3rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center p-10 group cursor-pointer overflow-hidden
                                        ${isDragActive ? 'border-cyan-500 bg-cyan-500/5 scale-[0.99]' : 'border-white/10 bg-white/2 hover:border-white/20'}
                                    `}
                                >
                                <input {...getInputProps()} />
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                
                                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                        <UploadCloud className="w-10 h-10 text-cyan-500 group-hover:animate-bounce" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white tracking-tighter">
                                            {isDragActive ? 'Deploy Files' : 'Ingest Sources'}
                                        </h3>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                            {tool === 'compare' ? 'Select exactly two documents' : 'Drag and drop or click to select'}
                                        </p>
                                    </div>
                                    
                                    {files.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                                            {files.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300">
                                                    <FileIcon size={12} className="text-cyan-500" />
                                                    {f.name}
                                                    <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="hover:text-red-500 transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {config.multiple && tool !== 'compare' && (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs font-black text-cyan-500">
                                                    <Plus size={12} /> Add More
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                        )}

                        {downloadUrl && (
                            <motion.div
                                key="download"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center space-y-10 text-center"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
                                    <div className="relative w-32 h-32 rounded-full bg-white/5 border border-emerald-500/30 flex items-center justify-center">
                                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Protocol Executed</h2>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Document processing finalized successfully</p>
                                </div>
                                <div className="flex flex-col gap-4 w-full max-w-sm">
                                    <a
                                        href={downloadUrl}
                                        download={`SwiftPDF_Result_${tool}.${settings._downloadExt || 'pdf'}`}
                                        className="w-full py-5 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3"
                                    >
                                        <Download size={18} /> Download Asset
                                    </a>
                                    <button 
                                        onClick={() => { setFiles([]); setDownloadUrl(null); }}
                                        className="w-full py-5 bg-white/5 text-gray-500 hover:text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/5 transition-all"
                                    >
                                        New Operation
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {extractedText && (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="glass-panel border border-white/5 rounded-[3rem] p-10 relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Data Harvest Results</h2>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(extractedText || '');
                                                addToast('Copied to system clipboard.', 'success');
                                            }}
                                            className="text-[10px] font-black text-cyan-500 hover:text-white uppercase tracking-widest"
                                        >
                                            Copy Full Report
                                        </button>
                                    </div>
                                    <textarea 
                                        readOnly
                                        value={extractedText || ''}
                                        className="w-full h-96 p-6 bg-white/5 border border-white/10 rounded-2xl font-mono text-sm text-gray-300 resize-none focus:outline-none custom-scrollbar"
                                    />
                                    <button
                                        onClick={() => { setFiles([]); setExtractedText(null); }}
                                        className="mt-8 w-full py-4 bg-white/5 text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 transition-all"
                                    >
                                        Reset Interface
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {compareReport && (
                            <motion.div
                                key="compare"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-panel border border-white/5 rounded-[3rem] p-10 space-y-8"
                            >
                                <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Comparison Matrix</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                                        <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Doc 1 Scope</p>
                                        <p className="text-2xl font-black text-white">{compareReport.doc1_pages} Pages</p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                                        <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Doc 2 Scope</p>
                                        <p className="text-2xl font-black text-white">{compareReport.doc2_pages} Pages</p>
                                    </div>
                                    <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                                        <p className="text-emerald-500 text-[10px] font-black uppercase mb-1">Identical Match</p>
                                        <p className="text-2xl font-black text-emerald-400">{compareReport.identical_page_count} Pages</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setFiles([]); setCompareReport(null); }}
                                    className="w-full py-4 bg-white/5 text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl border border-white/5 transition-all"
                                >
                                    Reset Matrix
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            
            {tool === 'organize' && files.length > 0 && !downloadUrl && (
                <div className="mt-16">
                    <PDFOrganizer
                        file={files[0]}
                        onUpdate={(order, rotation) => {
                            setSettings({
                                ...settings,
                                page_order: order.join(','),
                                rotation: JSON.stringify(rotation)
                            });
                        }}
                    />
                </div>
            )}
        </main>
    );
}


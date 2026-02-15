'use client';

import { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Download, File, X, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ToastProvider';
import PDFOrganizer from '@/components/PDFOrganizer';

interface ToolInterfaceProps {
    tool: string;
}

export default function ToolInterface({ tool }: ToolInterfaceProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toolConfig: any = {
        merge: { title: 'Merge PDF', description: 'Combine PDFs in the order you want.', multiple: true, endpoint: '/api/process/merge', color: 'text-red-700', gradient: 'from-red-500 to-orange-500' },
        split: { title: 'Split PDF', description: 'Separate one page or a whole set for easy conversion.', multiple: false, endpoint: '/api/process/split', color: 'text-orange-700', gradient: 'from-orange-500 to-yellow-500' },
        organize: { title: 'Organize PDF', description: 'Sort pages of your PDF file however you like.', multiple: false, endpoint: '/api/process/organize', color: 'text-yellow-700', gradient: 'from-yellow-400 to-orange-400' },
        compress: { title: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', multiple: false, endpoint: '/api/process/compress', color: 'text-green-700', gradient: 'from-green-500 to-emerald-500' },
        'pdf-to-jpg': { title: 'PDF to JPG', description: 'Convert each PDF page into a JPG or extract all images.', multiple: false, endpoint: '/api/process/pdf-to-jpg', color: 'text-teal-700', gradient: 'from-teal-500 to-cyan-500' },
        'jpg-to-pdf': { title: 'JPG to PDF', description: 'Convert your images to a PDF.', multiple: true, endpoint: '/api/process/jpg-to-pdf', accept: { 'image/*': ['.jpg', '.jpeg', '.png'] }, color: 'text-blue-700', gradient: 'from-blue-500 to-indigo-500' },
        lock: { title: 'Lock PDF', description: 'Protect PDF files with a password.', multiple: false, endpoint: '/api/process/lock', color: 'text-indigo-700', gradient: 'from-indigo-500 to-purple-500' },
        unlock: { title: 'Unlock PDF', description: 'Remove PDF password security.', multiple: false, endpoint: '/api/process/unlock', color: 'text-purple-700', gradient: 'from-purple-500 to-pink-500' },
        watermark: { title: 'Watermark PDF', description: 'Stamp an image or text over your PDF.', multiple: false, endpoint: '/api/process/watermark', color: 'text-pink-700', gradient: 'from-pink-500 to-rose-500' },
    };

    const config = toolConfig[tool];

    const { addToast } = useToast();

    // File Upload Logic
    const onDrop = (acceptedFiles: File[]) => {
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
            addToast('Please upload at least one file', 'error');
            return;
        }
        setLoading(true);
        setError(null);
        setDownloadUrl(null);

        const formData = new FormData();
        files.forEach((file) => formData.append(config.multiple ? 'files' : 'file', file));

        Object.keys(settings).forEach(key => {
            formData.append(key, settings[key]);
        });

        try {
            const response = await axios.post(config.endpoint, formData, {
                responseType: 'blob',
            });

            const contentType = response.headers['content-type'];
            let ext = 'pdf';
            if (contentType === 'application/zip') ext = 'zip';
            if (contentType === 'image/jpeg') ext = 'jpg';

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
            setSettings({ ...settings, _downloadExt: ext });
            addToast('File processed successfully!', 'success');
        } catch (err: any) {
            console.error(err);
            const msg = 'An error occurred during processing. Please check your inputs.';
            setError(msg);
            addToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 md:pt-32 px-4 pb-12 w-full max-w-5xl mx-auto">
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-700 transition-colors mb-6 md:mb-8 group font-medium text-sm md:text-base">
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to tools
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-1`}>
                        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 text-center rounded-t-[22px]">
                            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${config.color}`}>{config.title}</h1>
                            <p className="text-gray-800 text-base md:text-lg font-medium">{config.description}</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-12">
                        {!downloadUrl ? (
                            <div className="space-y-8 md:space-y-10">
                                {/* Upload Zone */}
                                <div
                                    {...getRootProps()}
                                    className={`border-3 border-dashed rounded-3xl p-6 md:p-10 text-center cursor-pointer transition-all duration-300 group
                                        ${isDragActive ? 'border-blue-600 bg-blue-50 scale-[1.02]' : 'border-gray-400 hover:border-blue-500 hover:bg-gray-50'}
                                    `}
                                >
                                    <input {...getInputProps()} />
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-blue-700' : 'text-blue-600'}`} />
                                    </div>
                                    <p className="text-xl font-bold text-gray-800 mb-2">
                                        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                                    </p>
                                    <p className="text-gray-600 font-medium">or click to browse files</p>
                                </div>

                                {/* File List & Settings */}
                                <AnimatePresence>
                                    {files.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-3">
                                                {files.map((f, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-xl shadow-sm"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                                <File className="w-6 h-6 text-gray-700" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">{f.name}</p>
                                                                <p className="text-xs text-gray-600 font-medium">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Settings Forms */}
                                            <div className="bg-gray-50/90 p-6 rounded-2xl border border-gray-300">
                                                <h3 className="text-lg font-bold mb-4 text-gray-900">Settings</h3>

                                                {tool === 'split' && (
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-bold text-gray-800 mb-2">Page Range</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-gray-900 bg-white"
                                                            placeholder="e.g., 1-5, 8"
                                                            onChange={(e) => setSettings({ ...settings, page_range: e.target.value })}
                                                        />
                                                    </div>
                                                )}
                                                {tool === 'organize' && (
                                                    <div className="space-y-4">
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
                                                {tool === 'compress' && (
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-bold text-gray-800 mb-2">Compression Level</label>
                                                        <select
                                                            className="w-full p-3 border border-gray-400 rounded-xl bg-white text-gray-900"
                                                            onChange={(e) => setSettings({ ...settings, level: e.target.value })}
                                                            defaultValue="medium"
                                                        >
                                                            <option value="low">Low Compression (High Quality)</option>
                                                            <option value="medium">Medium Compression</option>
                                                            <option value="high">High Compression (Smallest Size)</option>
                                                        </select>
                                                    </div>
                                                )}
                                                {(tool === 'lock' || tool === 'unlock') && (
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-bold text-gray-800 mb-2">Password</label>
                                                        <input
                                                            type="password"
                                                            className="w-full p-3 border border-gray-400 rounded-xl text-gray-900 bg-white"
                                                            placeholder="Enter password"
                                                            onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                                                        />
                                                    </div>
                                                )}
                                                {tool === 'watermark' && (
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-bold text-gray-800 mb-2">Watermark Text</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-3 border border-gray-400 rounded-xl text-gray-900 bg-white"
                                                            placeholder="e.g., CONFIDENTIAL"
                                                            onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                                                        />
                                                    </div>
                                                )}

                                                {/* No settings message */}
                                                {!['split', 'organize', 'compress', 'lock', 'unlock', 'watermark'].includes(tool) && (
                                                    <p className="text-gray-600 italic font-medium">No additional settings for this tool.</p>
                                                )}
                                            </div>

                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white text-lg font-bold rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100 shadow-md`}
                                            >
                                                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : 'Process PDF'}
                                                {loading && 'Processing...'}
                                            </button>
                                            {error && <p className="text-red-600 mt-2 text-center font-bold bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                                    <Download className="w-12 h-12 text-green-700" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your file is ready!</h2>
                                <p className="text-gray-700 mb-8 max-w-md mx-auto font-medium">Your document has been processed successfully. Click the button below to download it.</p>

                                <a
                                    href={downloadUrl}
                                    download={`processed_${tool}.${settings._downloadExt || 'pdf'}`}
                                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-lg font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all shadow-md"
                                >
                                    Download File
                                </a>

                                <button
                                    onClick={() => { setFiles([]); setDownloadUrl(null); }}
                                    className="block mx-auto mt-8 text-gray-600 hover:text-gray-900 font-bold hover:underline transition-colors"
                                >
                                    Process another file
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}

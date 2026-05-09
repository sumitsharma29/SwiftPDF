'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    Loader2, 
    Type, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    Save,
    MousePointer2,
    Move,
    SearchCode,
    Sparkles
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface PDFEditorProps {
    file: File;
    onSave: (edits: any[]) => void;
}

interface Word {
    text: string;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

interface PageData {
    url: string;
    width: number;
    height: number;
    words: Word[];
}

interface Edit {
    id: string;
    page: number;
    x: number;
    y: number;
    text: string;
    search_text?: string;
    size: number;
    mode: 'overlay' | 'replace';
}

export default function PDFEditor({ file, onSave }: PDFEditorProps) {
    const [pages, setPages] = useState<PageData[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [edits, setEdits] = useState<Edit[]>([]);
    const [activeTool, setActiveTool] = useState<'view' | 'text' | 'replace'>('view');
    const [hoveredWord, setHoveredWord] = useState<Word | null>(null);
    
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPreviews();
    }, [file]);

    const fetchPreviews = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post('/api/process/preview', formData);
            setPages(res.data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleWordClick = (word: Word) => {
        const page = pages[currentPage];
        
        // Browser Y is from top, Fitz Y is from top too.
        // We want our backend target Y to be from bottom (current implementation)
        // fitz_y = page.height - y_from_bottom => y_from_bottom = page.height - fitz_y
        // We'll use the center of the word
        const centerY = (word.y0 + word.y1) / 2;
        const centerX = (word.x0 + word.x1) / 2;

        const newEdit: Edit = {
            id: Math.random().toString(36).substr(2, 9),
            page: currentPage,
            x: centerX,
            y: page.height - centerY,
            text: word.text,
            search_text: word.text,
            size: (word.y1 - word.y0) * 0.8,
            mode: 'replace'
        };
        
        setEdits([...edits, newEdit]);
        setHoveredWord(null);
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (activeTool === 'view' || !canvasRef.current || pages.length === 0) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const page = pages[currentPage];
        
        const xClick = e.clientX - rect.left;
        const yClick = rect.bottom - e.clientY; 

        const scaleX = page.width / rect.width;
        const scaleY = page.height / rect.height;

        const newEdit: Edit = {
            id: Math.random().toString(36).substr(2, 9),
            page: currentPage,
            x: xClick * scaleX,
            y: yClick * scaleY,
            text: activeTool === 'replace' ? 'New Text' : 'Add Content',
            search_text: activeTool === 'replace' ? 'Original Text' : undefined,
            size: 14,
            mode: activeTool === 'replace' ? 'replace' : 'overlay'
        };
        
        setEdits([...edits, newEdit]);
        setActiveTool('view');
    };

    const updateEdit = (id: string, updates: Partial<Edit>) => {
        setEdits(edits.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const removeEdit = (id: string) => {
        setEdits(edits.filter(e => e.id !== id));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-40 glass-panel rounded-[3rem] border border-white/5">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mb-6" />
                <p className="text-cyan-500/50 font-black uppercase tracking-[0.3em] text-[10px]">Mapping Neural Hotspots...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-8 h-[850px]">
                {/* Floating Pro Toolbar */}
                <div className="w-20 glass-panel rounded-[2.5rem] border border-white/5 flex flex-col items-center py-8 gap-6 self-start sticky top-10">
                    <button 
                        onClick={() => setActiveTool('view')}
                        className={`p-4 rounded-2xl transition-all ${activeTool === 'view' ? 'bg-cyan-500 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="Pro Selection"
                    >
                        <MousePointer2 size={20} />
                    </button>
                    <button 
                        onClick={() => setActiveTool('text')}
                        className={`p-4 rounded-2xl transition-all ${activeTool === 'text' ? 'bg-cyan-500 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="Add Text"
                    >
                        <Type size={20} />
                    </button>
                    <button 
                        onClick={() => setActiveTool('replace')}
                        className={`p-4 rounded-2xl transition-all ${activeTool === 'replace' ? 'bg-indigo-500 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="Search & Replace"
                    >
                        <SearchCode size={20} />
                    </button>
                    <div className="flex-grow" />
                    <button 
                        onClick={() => onSave(edits)}
                        className="p-4 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-xl"
                        title="Save PDF"
                    >
                        <Save size={20} />
                    </button>
                </div>

                {/* Main Workspace */}
                <div className="flex-grow flex flex-col gap-6">
                    <div className="flex items-center justify-between px-10 py-6 glass-panel rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center gap-8">
                            <button 
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-10 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.5em]">
                                    Page {currentPage + 1}
                                </span>
                            </div>
                            <button 
                                disabled={currentPage === pages.length - 1}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-10 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                Interactive Hotspots: <span className="text-emerald-400">Active</span>
                            </span>
                        </div>
                    </div>

                    <div 
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className={`flex-grow glass-panel rounded-[3.5rem] border border-white/5 overflow-hidden relative shadow-2xl bg-[#0a0a0a] ${activeTool !== 'view' ? 'cursor-crosshair' : 'cursor-default'}`}
                    >
                        <div className="absolute inset-0 flex items-center justify-center p-10 overflow-auto custom-scrollbar">
                            <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-white overflow-hidden">
                                {pages[currentPage] && (
                                    <img 
                                        src={pages[currentPage].url} 
                                        alt="Document" 
                                        className="max-h-full w-auto select-none pointer-events-none"
                                    />
                                )}

                                {/* Interactive Word Hotspots */}
                                {activeTool === 'view' && pages[currentPage]?.words.map((word, idx) => {
                                    const page = pages[currentPage];
                                    return (
                                        <div 
                                            key={`word-${idx}`}
                                            className="absolute border border-transparent hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-text transition-all z-10"
                                            style={{
                                                left: `${(word.x0 / page.width) * 100}%`,
                                                top: `${(word.y0 / page.height) * 100}%`,
                                                width: `${((word.x1 - word.x0) / page.width) * 100}%`,
                                                height: `${((word.y1 - word.y0) / page.height) * 100}%`
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleWordClick(word);
                                            }}
                                        />
                                    );
                                })}

                                {/* Edits Overlay */}
                                {edits.filter(e => e.page === currentPage).map(edit => {
                                    const page = pages[currentPage];
                                    return (
                                        <motion.div 
                                            key={edit.id}
                                            drag
                                            dragMomentum={false}
                                            onDragEnd={(_, info) => {
                                                if (!canvasRef.current) return;
                                                const rect = canvasRef.current.getBoundingClientRect();
                                                const scaleX = page.width / rect.width;
                                                const scaleY = page.height / rect.height;
                                                updateEdit(edit.id, { 
                                                    x: edit.x + (info.offset.x * scaleX),
                                                    y: edit.y - (info.offset.y * scaleY)
                                                });
                                            }}
                                            className={`absolute p-4 rounded-xl shadow-2xl cursor-move flex flex-col gap-3 min-w-[200px] border-2 z-20 ${edit.mode === 'replace' ? 'bg-white border-indigo-500 shadow-indigo-500/20' : 'bg-white border-cyan-500 shadow-cyan-500/20'}`}
                                            style={{ 
                                                left: `${(edit.x / page.width) * 100}%`, 
                                                bottom: `${(edit.y / page.height) * 100}%`,
                                                transform: 'translate(-50%, 100%)'
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">
                                                    {edit.mode === 'replace' ? 'Replace Mode' : 'New Layer'}
                                                </span>
                                                <button onClick={() => removeEdit(edit.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <input 
                                                    value={edit.text}
                                                    onChange={(e) => updateEdit(edit.id, { text: e.target.value })}
                                                    className="bg-gray-50 p-2 rounded-lg text-sm font-bold w-full outline-none text-black border border-gray-100 focus:border-indigo-500/50"
                                                    placeholder="Type over..."
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 mt-1">
                                                <input 
                                                    type="range" min="6" max="48" value={edit.size}
                                                    onChange={(e) => updateEdit(edit.id, { size: parseInt(e.target.value) })}
                                                    className="w-full h-1 accent-indigo-500"
                                                />
                                                <span className="text-[9px] font-bold text-gray-400">{Math.round(edit.size)}pt</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="glass-panel rounded-[2rem] border border-white/5 p-6 flex items-center justify-between">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-3">
                    <span className="p-1 bg-cyan-500/20 text-cyan-500 rounded">PRO</span>
                    Hover and click any text in the document to edit it directly.
                </p>
                <div className="flex gap-4">
                     <div className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
                        {edits.length} Elements Architected
                    </div>
                </div>
            </div>
        </div>
    );
}

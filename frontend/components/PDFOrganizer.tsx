'use client';

import { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, Loader2, LayoutGrid } from 'lucide-react';
import axios from 'axios';

interface PDFOrganizerProps {
    file: File;
    onUpdate: (order: number[], rotation: { [key: number]: number }) => void;
}

interface PageItem {
    id: string; // Unique ID for dnd-kit
    originalIndex: number;
    previewUrl: string;
    rotation: number;
}

function SortableItem({ page, onRotate }: { page: PageItem; onRotate: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative group touch-none"
        >
            <div className="aspect-[3/4] bg-white/5 rounded-2xl shadow-2xl border border-white/5 overflow-hidden relative group-hover:border-cyan-500/50 transition-all duration-300">
                <img
                    src={page.previewUrl}
                    alt={`Page ${page.originalIndex + 1}`}
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-500 bg-white/10"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                />

                {/* Page Number Badge */}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 uppercase tracking-widest">
                    P. {page.originalIndex + 1}
                </div>

                {/* Rotate Button */}
                <button
                    className="absolute bottom-3 right-3 p-2 bg-cyan-500 text-white rounded-xl shadow-lg hover:bg-cyan-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-90"
                    onPointerDown={(e) => {
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRotate(page.id);
                    }}
                >
                    <RotateCw size={14} />
                </button>
            </div>
        </div>
    );
}

export default function PDFOrganizer({ file, onUpdate }: PDFOrganizerProps) {
    const [pages, setPages] = useState<PageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchPreviews();
    }, [file]);

    useEffect(() => {
        if (pages.length > 0) {
            const order = pages.map(p => p.originalIndex);
            const rotationDict: { [key: number]: number } = {};
            pages.forEach(p => {
                if (p.rotation !== 0) {
                    rotationDict[p.originalIndex] = p.rotation;
                }
            });
            onUpdate(order, rotationDict);
        }
    }, [pages]);

    const fetchPreviews = async () => {
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/process/preview', formData);
            const newPages = res.data.pages.map((url: string, index: number) => ({
                id: `page-${index}`,
                originalIndex: index,
                previewUrl: url,
                rotation: 0
            }));
            setPages(newPages);
        } catch (err) {
            console.error(err);
            setError('Architectural scan failed. Preview unavailable.');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPages((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleRotate = (id: string) => {
        setPages(items => items.map(item => {
            if (item.id === id) {
                return { ...item, rotation: (item.rotation + 90) % 360 };
            }
            return item;
        }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-[3rem] border border-white/5 animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
                <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">Scanning Architecture...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 glass-panel rounded-[3rem] border border-red-500/20 text-center">
                <p className="text-red-400 font-black uppercase tracking-widest text-xs">{error}</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-10 rounded-[3rem] border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LayoutGrid size={20} className="text-cyan-500" />
                    <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">Document Blueprint</h3>
                </div>
                <div className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-black border border-cyan-500/20 uppercase tracking-widest">
                    {pages.length} Pages Detected
                </div>
            </div>

            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                Drag elements to restructure hierarchy • Use <RotateCw size={10} className="inline mx-1" /> for orientation
            </p>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={pages.map(p => p.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {pages.map((page) => (
                            <SortableItem key={page.id} page={page} onRotate={handleRotate} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}


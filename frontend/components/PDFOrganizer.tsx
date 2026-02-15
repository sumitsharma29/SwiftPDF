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
import { RotateCw, Loader2 } from 'lucide-react';
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
            <div className="aspect-[3/4] bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative">
                <img
                    src={page.previewUrl}
                    alt={`Page ${page.originalIndex + 1}`}
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-300"
                    style={{ transform: `rotate(${page.rotation}deg)` }}
                />

                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    {page.originalIndex + 1}
                </div>

                {/* Rotate Button */}
                <button
                    className="absolute bottom-2 right-2 p-1.5 bg-white text-gray-700 rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    onPointerDown={(e) => {
                        // Prevent drag start
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag
                        onRotate(page.id);
                    }}
                >
                    <RotateCw size={16} />
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
        // Notify parent whenever state changes
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
            const res = await axios.post('http://localhost:8000/api/process/preview', formData);
            const newPages = res.data.pages.map((url: string, index: number) => ({
                id: `page-${index}`,
                originalIndex: index,
                previewUrl: url,
                rotation: 0
            }));
            setPages(newPages);
        } catch (err) {
            console.error(err);
            setError('Failed to load page previews.');
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
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="text-gray-600 font-medium">Generating thumbnails...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center py-4 bg-red-50 rounded-lg">{error}</p>;
    }

    return (
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-4 font-medium flex items-center justify-between">
                <span>Drag pages to reorder • Click <RotateCw size={14} className="inline" /> to rotate</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{pages.length} Pages</span>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {pages.map((page) => (
                            <SortableItem key={page.id} page={page} onRotate={handleRotate} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

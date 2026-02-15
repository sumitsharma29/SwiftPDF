'use client';

import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { useCallback } from 'react';
import { clsx } from 'clsx';

interface FileUploadProps {
    onFiles: (files: File[]) => void;
    accept?: Record<string, string[]>;
    multiple?: boolean;
    className?: string;
}

export default function FileUpload({ onFiles, accept, multiple = false, className }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFiles(acceptedFiles);
        }
    }, [onFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    });

    return (
        <div
            {...getRootProps()}
            className={clsx(
                'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-blue-100 rounded-full">
                    <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <p className="text-xl font-medium text-gray-700">
                        {isDragActive ? 'Drop files here' : 'Select PDF files'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        or drag and drop them here
                    </p>
                </div>
                <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                    Select PDF files
                </button>
            </div>
        </div>
    );
}

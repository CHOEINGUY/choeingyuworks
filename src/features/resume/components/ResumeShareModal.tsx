"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Facebook, Twitter, Linkedin, Copy, Check, X } from "lucide-react";

interface ResumeShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        name: string;
        role: string;
    };
}

export const ResumeShareModal = ({ isOpen, onClose, data }: ResumeShareModalProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div 
                ref={modalRef}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200"
            >
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">이력서 공유하기</h3>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                    <a 
                        href={`mailto:?subject=${encodeURIComponent(`${data.name} - ${data.role}`)}&body=${encodeURIComponent(`Check out this resume: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#333] hover:scale-110 transition-transform text-white"
                        title="Email"
                    >
                        <Mail className="w-6 h-6" />
                    </a>
                    <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1877F2] hover:scale-110 transition-transform text-white"
                        title="Facebook"
                    >
                        <Facebook className="w-6 h-6" />
                    </a>
                    <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${data.name} - ${data.role}`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-black hover:scale-110 transition-transform text-white"
                        title="X (Twitter)"
                    >
                        <Twitter className="w-5 h-5 fill-white" />
                    </a>
                    <a 
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0A66C2] hover:scale-110 transition-transform text-white"
                        title="LinkedIn"
                    >
                        <Linkedin className="w-5 h-5 fill-white" />
                    </a>
                </div>
                
                <div className="relative">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <span className="flex-1 text-sm text-gray-600 truncate font-mono">
                            {typeof window !== 'undefined' ? window.location.href : ''}
                        </span>
                        <button
                            onClick={copyToClipboard}
                            className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                                isCopied 
                                    ? "bg-green-50 text-green-600" 
                                    : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
                            }`}
                            title="Copy Link"
                        >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    {isCopied && (
                        <span className="absolute -top-8 right-0 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded animate-in fade-in slide-in-from-bottom-2">
                            Copied!
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

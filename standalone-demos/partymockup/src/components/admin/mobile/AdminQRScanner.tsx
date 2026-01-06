import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import QRScannerView from '../../common/QRScannerView';

interface AdminQRScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (result: string) => void;
}

const AdminQRScanner: React.FC<AdminQRScannerProps> = ({ isOpen, onClose, onScan }) => {
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleWebcamError = (err: any) => {
        console.error("Scanner Error:", err);
        // setError("카메라 접근권한을 확인해주세요.");
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent pb-12">
                <div className="text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Camera size={20} />
                        QR 코드 스캔
                    </h2>
                    <p className="text-sm text-white/70">참가자의 입장 QR을 스캔해주세요.</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Camera View */}
            <div className="w-full h-full relative flex items-center justify-center bg-black">
                <QRScannerView
                    onScan={onScan}
                    onError={handleWebcamError}
                    className="w-full h-full object-cover"
                />

                {/* Overlay Frame */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-80 h-[32rem] border-2 border-white/50 rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl -mt-1 -ml-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl -mt-1 -mr-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl -mb-1 -ml-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl -mb-1 -mr-1"></div>
                    </div>
                </div>

                {error && (
                    <div className="absolute top-1/2 left-0 right-0 text-center text-red-500 bg-black/80 p-4">
                        {error}
                    </div>
                )}
            </div>

            {/* Bottom Hint */}
            <div className="absolute bottom-10 left-0 right-0 text-center z-10">
                <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
                    사각형 안에 QR 코드를 맞춰주세요
                </p>
            </div>
        </div>
    );
};

export default AdminQRScanner;

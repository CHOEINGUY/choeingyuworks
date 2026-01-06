import React from 'react';
import { useZxing } from "react-zxing";

interface QRScannerViewProps {
    onScan: (text: string) => void;
    onError?: (error: any) => void;
    className?: string;
}

const QRScannerView: React.FC<QRScannerViewProps> = ({ onScan, onError, className }) => {
    const { ref } = useZxing({
        onDecodeResult(result: any) {
            if (result) {
                const text = result.getText();
                // console.log("QR Scanned:", text);
                if (onScan) onScan(text);
            }
        },
        onError(err: any) {
            // console.error("QR Error:", err);
            if (onError) onError(err);
        },
        constraints: {
            video: { facingMode: 'environment' }
        }
    });

    return (
        <video
            ref={ref}
            className={className || "w-full h-full object-cover"}
        />
    );
};

export default QRScannerView;

"use client";

import React, { useEffect, useRef } from "react";

export const ResumeQRCode = () => {
    const qrCodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initQRCode = async () => {
            try {
                const QRCodeStylingLib = (await import("qr-code-styling")).default;
                
                const qrCode = new QRCodeStylingLib({
                    width: 90,
                    height: 90,
                    type: "svg",
                    data: "https://choeingyu.works",
                    dotsOptions: {
                        color: "#18181b", // zinc-900
                        type: "extra-rounded"
                    },
                    cornersSquareOptions: {
                        type: "extra-rounded",
                        color: "#18181b"
                    },
                    cornersDotOptions: {
                        type: "dot",
                        color: "#18181b"
                    },
                    backgroundOptions: {
                        color: "#ffffff",
                    },
                    imageOptions: {
                        crossOrigin: "anonymous",
                        margin: 0
                    }
                });

                if (qrCodeRef.current) {
                    qrCodeRef.current.innerHTML = '';
                    qrCode.append(qrCodeRef.current);
                }
            } catch (err) {
                console.error("Failed to load QR code library", err);
            }
        };

        initQRCode();
    }, []);

    return (
        <div className="flex flex-col items-center gap-1 opacity-80">
            <span className="text-[11px] text-gray-900 font-bold tracking-tight font-mono mb-1">
                choeingyu.works
            </span>
            
            <div ref={qrCodeRef} className="mix-blend-multiply" />
            
            <span className="text-[10px] text-gray-500 font-medium tracking-tight mt-1">
                Link to Portfolio
            </span>
        </div>
    );
};

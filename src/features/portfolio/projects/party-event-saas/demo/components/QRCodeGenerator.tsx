"use client";

import React, { useEffect, useRef } from 'react';

export const QRCodeGenerator = ({ data }: { data: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<any>(null);

    useEffect(() => {
        let mounted = true;
        import('qr-code-styling').then((QRCodeStylingModule) => {
            if (!mounted) return;
            const QRCodeStyling = QRCodeStylingModule.default;
            if (ref.current) ref.current.innerHTML = '';
            qrCode.current = new QRCodeStyling({
                width: 200,
                height: 200,
                type: "svg",
                data: data,
                dotsOptions: { color: "#000000", type: "rounded" },
                cornersSquareOptions: { color: "#000000", type: "extra-rounded" },
                backgroundOptions: { color: "#ffffff" },
                imageOptions: { crossOrigin: "anonymous", margin: 10 },
                margin: 0
            });
            if (ref.current) qrCode.current.append(ref.current);
        });
        return () => { mounted = false; };
    }, [data]);

    return <div ref={ref} className="flex justify-center items-center" />;
};

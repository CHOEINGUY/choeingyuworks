import React, { useEffect, useRef } from 'react';
// @ts-ignore
import QRCodeStyling from 'qr-code-styling';

interface QRCodeGeneratorProps {
    data: string;
    width?: number;
    height?: number;
    image?: string;
    dotsColor?: string;
    cornerColor?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
    data,
    width = 300,
    height = 300,
    image,
    dotsColor = "#2c3e50",
    cornerColor = "#2c3e50"
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling>(null);

    useEffect(() => {
        qrCode.current = new QRCodeStyling({
            width: width,
            height: height,
            type: "svg",
            data: data,
            image: image,
            dotsOptions: {
                color: dotsColor,
                type: "rounded"
            },
            cornersSquareOptions: {
                color: cornerColor,
                type: "extra-rounded"
            },
            cornersDotOptions: {
                color: cornerColor,
                type: "dot"
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10
            },
            margin: 0
        });

        if (ref.current) {
            qrCode.current.append(ref.current);
        }
    }, []);

    useEffect(() => {
        if (qrCode.current) {
            qrCode.current.update({
                width: width,
                height: height,
                data: data,
                image: image,
                dotsOptions: {
                    color: dotsColor
                },
                cornersSquareOptions: {
                    color: cornerColor
                },
                cornersDotOptions: {
                    color: cornerColor
                }
            });
        }
    }, [data, image, dotsColor, cornerColor, width, height]);

    return (
        <div ref={ref} className="flex justify-center items-center" />
    );
};

export default QRCodeGenerator;

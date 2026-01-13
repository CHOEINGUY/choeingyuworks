import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import QRCodeStyling from 'qr-code-styling';

interface QRCodeSectionProps {
    guestKey: string | null;
    eventDatetime: string | null;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ guestKey, eventDatetime }) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'loading' | 'active' | 'disabled' | 'error'>('loading');

    useEffect(() => {
        if (!guestKey) {
            setStatus('error');
            return;
        }

        // Logic for active/disabled based on time
        const isActive = true;

        if (!isActive) {
            setStatus('disabled');
        }

        // Initialize QR Code
        try {
            const qrCode = new QRCodeStyling({
                width: 200,
                height: 200,
                type: "svg",
                data: guestKey,
                margin: 0,
                qrOptions: {
                    typeNumber: 0,
                    mode: "Byte",
                    errorCorrectionLevel: "Q"
                },
                dotsOptions: {
                    type: "rounded",
                    color: "#2c3e50",
                    roundSize: true
                },
                backgroundOptions: {
                    round: 0,
                    color: "#ffffff"
                },
                cornersSquareOptions: {
                    type: "extra-rounded",
                    color: "#2c3e50"
                },
                cornersDotOptions: {
                    color: "#2c3e50"
                }
            });

            if (qrRef.current) {
                qrRef.current.innerHTML = '';
                const qrContainer = document.createElement('div');
                qrContainer.className = 'qr-container';
                if (!isActive) qrContainer.classList.add('qr-disabled');

                qrCode.append(qrContainer);

                // Add Logo Overlay
                const wavyLogo = document.createElement('img');
                wavyLogo.src = '/logo/Wavy_logo.png'; // Absolute path in public
                wavyLogo.alt = 'WAVY logo';
                wavyLogo.className = 'wavy-logo-overlay';
                qrContainer.appendChild(wavyLogo);

                if (!isActive) {
                    const disabledMessage = document.createElement('div');
                    disabledMessage.className = 'qr-disabled-message';
                    disabledMessage.textContent = '파티 1시간 전에 활성화됩니다';
                    qrContainer.appendChild(disabledMessage);
                }

                qrRef.current.appendChild(qrContainer);
                setStatus('active');
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }

    }, [guestKey, eventDatetime]);

    return (
        <section className="flex flex-col items-center w-full z-10">
            <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.6)] border-2 border-white/30 min-h-[232px] min-w-[232px] flex items-center justify-center relative">
                    {/* React controlled states */}
                    {status === 'loading' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl z-20">
                            <span className="text-zinc-300 text-sm animate-pulse">QR 생성 중...</span>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl z-20 p-4 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-zinc-400 text-xs font-medium leading-relaxed">
                                입장 키가 올바르지 않거나<br />초대장 정보가 부족합니다.
                            </span>
                        </div>
                    )}

                    {/* Manual DOM manipulation container - React should leave this alone */}
                    <div ref={qrRef} id="qr-code-container"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-8 flex items-center gap-3"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
                        <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 17V19C21 20.1046 20.1046 21 19 21H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white/80 text-xs font-light tracking-widest uppercase">
                        입장 시 호스트에게 QR코드를 보여주세요
                    </span>
                </motion.div>
            </div>

            <style>{`
                .qr-container {
                }
                .qr-container canvas {
                    display: block;
                    width: 100% !important;
                    height: auto !important;
                }
                .wavy-logo-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px;
                    height: 30px;
                    object-fit: contain;
                    background: rgba(255,255,255,0.9);
                    border-radius: 4px;
                    padding: 2px;
                    z-index: 20;
                }
                .qr-disabled::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(255, 255, 255, 0.9);
                    z-index: 10;
                }
                .qr-disabled-message {
                     position: absolute;
                     top: 50%;
                     left: 50%;
                     transform: translate(-50%, -50%);
                     color: #333;
                     font-weight: 600;
                     font-size: 0.9rem;
                     width: 100%;
                     text-align: center;
                     z-index: 20;
                }
             `}</style>
        </section>
    );
};

export default QRCodeSection;

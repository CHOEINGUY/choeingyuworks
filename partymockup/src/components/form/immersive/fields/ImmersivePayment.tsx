import React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ImmersivePaymentProps {
    field: {
        title?: string;
        description?: string;
        paymentDetails?: string;
        bankName?: string;
        accountNumber?: string;
        accountHolder?: string;
        otherInfo?: string;
    };
    onNext: () => void;
    themeStyles: any;
}

const ImmersivePayment: React.FC<ImmersivePaymentProps> = ({ field, onNext, themeStyles }) => {
    const {
        // title = "참가비 입금 안내",
        // description = "신청서 작성 후 티켓 비용을 입금해주세요",
        paymentDetails = "남성: 30,000원\n여성: 30,000원",
        bankName = "국민은행",
        accountNumber = "1231234123412",
        accountHolder = "최인규",
        otherInfo
    } = field;

    const [isCopied, setIsCopied] = React.useState(false);

    const bankInfo = {
        name: bankName,
        account: accountNumber,
        holder: accountHolder
    };

    const handleCopy = async () => {
        const textToCopy = `${bankInfo.name} ${bankInfo.account}`;

        try {
            // 1. Try Modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
                setIsCopied(true);
                toast.success('계좌번호가 복사되었습니다.');
            } else {
                throw new Error('Clipboard API not available');
            }
        } catch (err) {
            // 2. Fallback: textarea hack
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;

                // Ensure it's not visible but part of DOM
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);

                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    setIsCopied(true);
                    toast.success('계좌번호가 복사되었습니다.');
                } else {
                    console.error('Fallback copy failed');
                    toast.error('계좌번호 복사를 실패했습니다. 직접 복사해주세요.');
                }
            } catch (fallbackErr) {
                console.error('Copy failed completely', fallbackErr);
                toast.error('계좌번호 복사를 실패했습니다. 직접 복사해주세요.');
            }
        }

        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Price Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full mb-8"
            >
                <div className="flex flex-col items-center text-center space-y-3 mb-8">
                    <span className={`text-xs font-bold uppercase tracking-wider ${themeStyles.text_tertiary}`}>입금 관련 안내</span>
                    <div className={`text-xl font-medium whitespace-pre-wrap leading-relaxed ${themeStyles.text_primary}`}>
                        {paymentDetails}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-0">
                        <div className="flex flex-col items-center text-center">
                            {/* Bank Info & Account Number */}
                            <button
                                onClick={handleCopy}
                                className={`
                                    relative flex items-center justify-center gap-2 mb-2 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-center select-none w-full max-w-sm
                                    ${isCopied
                                        ? `${themeStyles.bg_checked} ${themeStyles.button_text || 'text-white'} shadow-md scale-105`
                                        : `${themeStyles.card_bg} border ${themeStyles.border_base} hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm active:scale-95`
                                    }
                                `}
                            >
                                <span className={`text-base font-medium ${isCopied ? (themeStyles.button_text || 'text-white') : themeStyles.text_secondary}`}>{bankInfo.name}</span>
                                <span className={`text-base font-medium ${isCopied ? (themeStyles.button_text || 'text-white') : themeStyles.text_primary}`}>{bankInfo.account}</span>
                                <div className={`ml-1 transition-transform ${isCopied ? 'scale-110' : ''}`}>
                                    {isCopied ? (
                                        <Check size={18} className={themeStyles.button_text || 'text-white'} strokeWidth={3} />
                                    ) : (
                                        <Copy size={16} className={themeStyles.text_tertiary} />
                                    )}
                                </div>
                            </button>

                            <div className="mt-2 flex items-center justify-center gap-2">
                                <span className={`text-sm ${themeStyles.text_secondary}`}>예금주: {bankInfo.holder}</span>
                            </div>
                        </div>
                    </div>

                    <p className={`text-sm text-center break-keep whitespace-pre-wrap pt-4 ${themeStyles.text_secondary}`}>
                        {otherInfo ? `* ${otherInfo}` : '* 입금자명과 신청자명이 동일해야 확인이 가능합니다.'}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ImmersivePayment;

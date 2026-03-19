"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, CheckCircle2, AlertCircle, Paperclip, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type FormData = {
    name: string;
    company: string;
    contact: string;
    painPoint: string;
    description: string;
    budget: string;
    file?: FileList;
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export default function RequestClient() {
    const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors } } = useForm<FormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const watchedFile = watch("file");

    const removeFile = (indexToRemove: number) => {
        const currentFiles = getValues("file");
        if (!currentFiles) return;

        const dt = new DataTransfer();
        Array.from(currentFiles).forEach((file, i) => {
            if (i !== indexToRemove) dt.items.add(file);
        });
        setValue("file", dt.files);
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        try {
            const attachments: { fileName: string; fileBase64: string }[] = [];
            let totalSize = 0;
            const MAX_TOTAL_SIZE_MB = 20;

            // 1. Process Files (Convert to Base64 & Validate Size)
            if (data.file && data.file.length > 0) {
                for (let i = 0; i < data.file.length; i++) {
                    const file = data.file[i];
                    totalSize += file.size;

                    if (totalSize > MAX_TOTAL_SIZE_MB * 1024 * 1024) {
                        alert(`전체 파일 용량은 ${MAX_TOTAL_SIZE_MB}MB를 초과할 수 없습니다.`);
                        setIsSubmitting(false);
                        return;
                    }

                    const base64 = await fileToBase64(file);
                    attachments.push({
                        fileName: file.name,
                        fileBase64: base64
                    });
                }
            }

            // 2. Firestore Save (Metadata only)
            const requestData = {
                ...data,
                file: attachments.length > 0 ? `Attached ${attachments.length} file(s): ${attachments.map(f => f.fileName).join(', ')}` : null,
                status: 'new',
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "requests"), requestData);

            // 3. Email Notification (with Attachments)
            fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    attachments // Send array
                }),
            }).catch(err => console.error("Email notification failed:", err));

            setSubmitStatus('success');
            reset();
        } catch (error) {
            console.error("Error submitting request: ", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-36 pb-20 md:pb-20 pb-[calc(5rem+env(safe-area-inset-bottom))] px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4 whitespace-pre-line">
                        반복되는 수작업,<br className="sm:hidden" /> 이제 시스템에 맡기세요.
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                        시스템 기획은 제가 하겠습니다. 대표님은 현재의 '불편함'만 알려주세요.<br className="hidden sm:block" />
                        수작업으로 관리하던 엑셀/데이터 흐름을 진단하여, 최적의 자동화 방식을 설계해 드립니다.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                            {/* Section 1: Basic Info */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                    기본 정보
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">성함</label>
                                        <input
                                            {...register("name", { required: true })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white text-base"
                                            placeholder="홍길동"
                                        />
                                        {errors.name && <span className="text-red-500 text-xs">필수 항목입니다.</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">회사/팀명</label>
                                        <input
                                            {...register("company", { required: true })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white text-base"
                                            placeholder="린디웍스"
                                        />
                                        {errors.company && <span className="text-red-500 text-xs">필수 항목입니다.</span>}
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">연락처 (이메일 또는 전화번호)</label>
                                        <input
                                            {...register("contact", { required: true })}
                                            inputMode="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white text-base"
                                            placeholder="010-1234-5678 또는 email@example.com"
                                        />
                                        {errors.contact && <span className="text-red-500 text-xs">필수 항목입니다.</span>}
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Section 2: Pain Point */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                    가장 해결하고 싶은 문제는 무엇인가요?
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { id: "automation", title: "반복 업무 자동화", desc: "매일 엑셀 복사/붙여넣기나 서류 작업에 지쳤습니다." },
                                        { id: "integration", title: "비즈니스 프로세스 통합", desc: "주문, 상담, 관리가 따로 놀아서 실수가 잦습니다." },
                                        { id: "dashboard", title: "데이터 관리 & 시각화", desc: "데이터는 많은데 한눈에 현황을 파악하기 어렵습니다." },
                                        { id: "new_service", title: "새로운 서비스 개발", desc: "아이디어를 실제 작동하는 웹/앱으로 만들고 싶습니다." },
                                        { id: "other", title: "기타 / 잘 모르겠습니다", desc: "문제는 있는데 정확한 원인이나 해결 방법을 모르겠습니다. 진단이 필요합니다." }
                                    ].map((option) => (
                                        <label key={option.id} className="relative flex items-start p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all group">
                                            <input
                                                type="radio"
                                                value={option.title}
                                                {...register("painPoint", { required: true })}
                                                className="mt-1 w-4 h-4 text-black border-gray-300 focus:ring-black"
                                            />
                                            <div className="ml-4">
                                                <span className="block text-base font-bold text-gray-900">{option.title}</span>
                                                <span className="block text-sm text-gray-500 mt-1">{option.desc}</span>
                                            </div>
                                        </label>
                                    ))}
                                    {errors.painPoint && <span className="text-red-500 text-xs ml-1">하나를 선택해주세요.</span>}
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Section 3: Budget (New) */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                                    생각하시는 예산 범위는 어느 정도인가요?
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "아직 잘 모르겠습니다 (상담 후 결정)",
                                        "100만원 미만 (단순 수정/자동화)",
                                        "100만원 ~ 300만원 (기능 개발/앱 구축)",
                                        "300만원 이상 (통합 시스템 구축)"
                                    ].map((option) => (
                                        <label key={option} className="relative flex items-center p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                                            <input
                                                type="radio"
                                                value={option}
                                                {...register("budget", { required: true })}
                                                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                                            />
                                            <span className="ml-3 font-medium text-gray-700 text-sm">{option}</span>
                                        </label>
                                    ))}
                                    {errors.budget && <span className="text-red-500 text-xs col-span-full ml-1">하나를 선택해주세요.</span>}
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Section 4: File Upload & Details */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                                    상세 내용 및 자료
                                </h2>

                                <div className="space-y-6">
                                    {/* File Input */}
                                    {/* File Input */}
                                    {/* File Input */}
                                    {watchedFile && watchedFile.length > 0 ? (
                                        <div className="space-y-3">
                                            {Array.from(watchedFile).map((file, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gray-50 border border-black rounded-xl p-4 flex items-center justify-between shadow-sm"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-5 h-5 text-black" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm text-gray-900 truncate pr-2">
                                                                {file.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {(file.size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                                                    >
                                                        <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                            <div className="pt-2 text-right">
                                                <label className="text-xs font-bold text-gray-500 cursor-pointer hover:text-black transition-colors">
                                                    + 파일 추가하기
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            if (e.target.files) {
                                                                const dt = new DataTransfer();
                                                                // Add existing
                                                                Array.from(watchedFile).forEach(f => dt.items.add(f));
                                                                // Add new
                                                                Array.from(e.target.files).forEach(f => dt.items.add(f));
                                                                setValue("file", dt.files);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors relative group">
                                            <input
                                                type="file"
                                                multiple
                                                {...register("file")}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-700 transition-colors">
                                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <Paperclip className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                                                </div>
                                                <p className="font-medium text-sm text-gray-900">참고 자료 (선택 사항)</p>
                                                <p className="text-xs text-gray-400 mt-1">사용 중인 엑셀, PDF, 이미지 등을 여러 개 첨부하실 수 있습니다.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Textarea */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 block">추가 요청사항</label>
                                        <textarea
                                            {...register("description", { required: true })}
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 focus:bg-white resize-none text-base"
                                            placeholder="예: 현재 엑셀로 주문을 정리해서 카톡으로 보내는데, 이걸 자동화하고 싶습니다.&#13;&#10;또는, 현재 사용중인 툴이 너무 불편해서 커스텀하고 싶습니다."
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = 'auto';
                                                target.style.height = `${target.scrollHeight}px`;
                                            }}
                                        />
                                        {errors.description && <span className="text-red-500 text-xs">내용을 입력해주세요.</span>}
                                    </div>
                                </div>
                            </section>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 text-lg font-bold rounded-xl bg-black text-white hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            견적 산출 중...
                                        </>
                                    ) : (
                                        "무료 진단 및 견적 받기"
                                    )}
                                </Button>
                                <div className="text-center mt-4">
                                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        작성해주신 내용은 철저히 비밀로 보호됩니다.
                                    </p>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal Overlay */}
            <AnimatePresence>
                {submitStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">문의가 접수되었습니다!</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                내용을 검토하여 24시간 이내에 <br />
                                기재해주신 연락처로 답변 드리겠습니다.
                            </p>
                            <Button
                                onClick={() => setSubmitStatus('idle')}
                                className="w-full h-12 rounded-xl bg-black text-white hover:bg-gray-800 font-bold"
                            >
                                확인
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Alert */}
            {submitStatus === 'error' && (
                <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
                </div>
            )}
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ExamEvent, PatientListItem } from "@/types";

interface TabletScreenProps {
    currentExam: ExamEvent & { examRoom: string; currentPerson: string };
    patientList: PatientListItem[];
    phase: string;
}

export function TabletScreen({ currentExam, patientList, phase }: TabletScreenProps) {
    const t = useTranslations("CohortDashboard.ExamFlow.Tablet");

    return (
        <div className="w-full h-full flex flex-col bg-white font-sans overflow-hidden rounded-lg">
            {/* Browser-like Address Bar - Safari style */}
            <div className="shrink-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 px-3 py-1">
                <div className="flex items-center bg-white rounded-md border border-gray-200 px-2 py-0.5">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1 text-xs text-gray-600">{t('headerTitle')}</span>
                    <svg className="w-3 h-3 text-gray-400 ml-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>
            {/* AppSheet Header */}
            <div className="shrink-0 h-12 bg-white border-b border-gray-300 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-xl">≡</span>
                    <span className="text-gray-800 font-bold text-lg">{currentExam.examRoom}</span>
                </div>
                <div className="text-gray-400 text-sm font-medium">
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
                {/* Left: Table View */}
                <div className="w-[45%] border-r border-gray-200 overflow-hidden flex flex-col">
                    <div className="shrink-0 px-4 py-2 text-sm text-gray-500 bg-gray-50 border-b border-gray-200 font-medium">
                        {t('today')} {currentExam.examRoom}
                    </div>
                    {/* Table Header */}
                    <div className="shrink-0 grid grid-cols-[38%_20%_42%] text-sm text-gray-500 bg-gray-50 border-b border-gray-200 font-bold">
                        <div className="px-1 py-1">{t('id')}</div>
                        <div className="px-1 py-1">{t('name')}</div>
                        <div className="px-1 py-1">{t('birth')}</div>
                    </div>
                    {/* Table Rows */}
                    <div className="flex-1 overflow-hidden">
                        {patientList.map((patient, idx) => (
                            <div 
                                key={patient.id}
                                className={`grid grid-cols-[38%_20%_42%] text-sm border-b border-gray-100 ${
                                    patient.name === currentExam.currentPerson 
                                        ? 'bg-sky-100' 
                                        : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                <div className="px-1 py-1 text-gray-600 truncate">{patient.id}</div>
                                <div className={`px-1 py-1 font-bold truncate ${
                                    patient.name === currentExam.currentPerson ? 'text-sky-700' : 'text-gray-800'
                                }`}>{patient.name}</div>
                                <div className="px-1 py-1 text-gray-500">{patient.birth}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Detail View */}
                <div className="flex-1 p-4 flex flex-col overflow-hidden">
                    <div className="text-sm text-gray-500 mb-1">{t('today')} {currentExam.examRoom}</div>
                    
                    {/* Selected Patient Name */}
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                        {currentExam.currentPerson} <span className="text-sm font-normal text-gray-400">
                            {patientList.find(p => p.name === currentExam.currentPerson)?.id || 'NW240101'}
                        </span>
                    </div>

                    {/* Status Label */}
                    <div className="text-sm text-gray-500 mb-2">{currentExam.examRoom}</div>
                    
                    {/* Status Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* 검사중 (In-Progress) Button */}
                        <motion.div 
                            className={`px-4 py-3 rounded-lg border text-center transition-all ${
                                phase === "tablet-clicking" && currentExam.type === "start"
                                    ? "bg-green-600 border-green-700"
                                    : "bg-gray-50 border-gray-200"
                            }`}
                            animate={phase === "tablet-clicking" && currentExam.type === "start" ? { scale: [1, 0.95, 1] } : {}}
                        >
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                phase === "tablet-clicking" && currentExam.type === "start" ? 'bg-white' : 'bg-green-500'
                            }`}></span>
                            <span className={`text-base font-bold ${
                                phase === "tablet-clicking" && currentExam.type === "start" ? 'text-white' : 'text-gray-600'
                            }`}>{t('statusing')}</span>
                        </motion.div>

                        {/* 완료 (Complete) Button */}
                        <motion.div 
                            className={`px-4 py-3 rounded-lg border text-center transition-all ${
                                phase === "tablet-clicking" && currentExam.type === "complete"
                                    ? "bg-gray-700 border-gray-800"
                                    : "bg-white border-gray-300"
                            }`}
                            animate={phase === "tablet-clicking" && currentExam.type === "complete" ? { scale: [1, 0.95, 1] } : {}}
                        >
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                phase === "tablet-clicking" && currentExam.type === "complete" ? 'bg-white' : 'bg-gray-800'
                            }`}></span>
                            <span className={`text-base font-bold ${
                                phase === "tablet-clicking" && currentExam.type === "complete" ? 'text-white' : 'text-gray-600'
                            }`}>{t('complete')}</span>
                        </motion.div>
                    </div>

                    {/* Birth Date Info */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">{t('birthLabel')}</div>
                        <div className="text-lg text-gray-700 font-mono">
                            {patientList.find(p => p.name === currentExam.currentPerson)?.birth || '1950-02-19'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="shrink-0 grid grid-cols-2 border-t border-gray-200">
                <div className="py-3 text-center bg-sky-600 text-white text-base font-bold">
                    {currentExam.examRoom}
                </div>
                <div className="py-3 text-center text-gray-500 text-base">
                    {t('progress')}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatusBoard } from "./subcomponents/StatusBoard";
import { TabletScreen } from "./subcomponents/TabletScreen";
import { TTSAnnouncement } from "./subcomponents/TTSAnnouncement";
import { useTranslations } from "next-intl";
import { BrowserFrame } from "@/features/portfolio/components/BrowserFrame";

// 실제 검진 목업 데이터 - 더 현실적인 이름들이 포함된 원본 리스트
const PATIENT_LIST = [
    { id: 'NW240101', name: '김순자', birth: '1945-03-12' },
    { id: 'NW240102', name: '이영수', birth: '1948-07-25' },
    { id: 'NW240103', name: '박정희', birth: '1952-11-08' },
    { id: 'NW240104', name: '최민호', birth: '1950-02-19' },
    { id: 'NW240105', name: '정영희', birth: '1947-09-03' },
    { id: 'NW240106', name: '한상철', birth: '1953-06-14' },
];

const BOARD_STATE = {
    snsbcRooms: [
        { roomNum: 1, current: '김순자', time: '18:45', next: '정영희' },
        { roomNum: 2, current: '이영수', time: '12:30', next: '한상철' },
        { roomNum: 3, current: '박정희', time: '08:15', next: null },
    ],
    stations: {
        ecg: { current: null, time: '-', next: '최민호' },
        blood: { current: null, time: '-', next: '김순자' },
        physical: { current: '최민호', time: '04:22', next: '한상철' },
    }
};

type AnimationPhase = 
    | "tablet-focus" 
    | "tablet-clicking" 
    | "statusboard-focus" 
    | "statusboard-blink" 
    | "statusboard-update"
    | "tts-announce";

interface ExamFlowAnimationProps {
    isEmbedded?: boolean;
    scale?: number;
    className?: string;
    isActive?: boolean;
}

export function ExamFlowAnimation({
    isEmbedded = false,
    scale,
    className,
    isActive = true
}: ExamFlowAnimationProps) {
    const t = useTranslations("CohortDashboard");
    const tExam = useTranslations("CohortDashboard.ExamFlow");

    const [currentStep, setCurrentStep] = useState(0);
    const [phase, setPhase] = useState<AnimationPhase>("tablet-focus");
    const [blinkingStation, setBlinkingStation] = useState<string | null>(null);
    const [showNextUpdate, setShowNextUpdate] = useState(false);
    const [blinkToggle, setBlinkToggle] = useState(false);

    const EXAM_SCENARIOS = useMemo(() => [
        { 
            type: "complete" as const,
            examRoom: t('Bottleneck.exams.body'),
            stationId: "physical",
            currentPerson: "최민호",
            nextPerson: "한상철",
            ttsText: tExam('TTS.message', {name: "한상철", room: t('Bottleneck.exams.body')}),
        },
        { 
            type: "start" as const,
            examRoom: t('Bottleneck.exams.ecg'),
            stationId: "ecg",
            currentPerson: "최민호",
            nextPerson: "최민호",
            ttsText: tExam('TTS.message', {name: "최민호", room: t('Bottleneck.exams.ecg')}),
        },
        { 
            type: "complete" as const,
            examRoom: `SNSB-C 1${tExam('StatusBoard.roomSuffix')}`,
            stationId: "snsbc-1",
            currentPerson: "김순자",
            nextPerson: "정영희",
            ttsText: tExam('TTS.message', {name: "정영희", room: `SNSB-C 1${tExam('StatusBoard.roomSuffix')}`}),
        },
        { 
            type: "start" as const,
            examRoom: t('Bottleneck.exams.blood'),
            stationId: "blood",
            currentPerson: "김순자",
            nextPerson: "김순자",
            ttsText: tExam('TTS.message', {name: "김순자", room: t('Bottleneck.exams.blood')}),
        },
    ], [t, tExam]);

    const currentExam = EXAM_SCENARIOS[currentStep];
    const currentScale = scale ?? (isEmbedded ? 0.55 : 1);

    useEffect(() => {
        if (!blinkingStation || !isActive) {
            setBlinkToggle(false);
            return;
        }
        const interval = setInterval(() => {
            setBlinkToggle(prev => !prev);
        }, 600);
        return () => clearInterval(interval);
    }, [blinkingStation, isActive]);

    useEffect(() => {
        if (!isActive) return;

        const timings: Record<AnimationPhase, number> = {
            "tablet-focus": 2500,
            "tablet-clicking": 700,
            "statusboard-focus": 1000,
            "statusboard-blink": 1500,
            "statusboard-update": 1200,
            "tts-announce": 2500,
        };

        const timer = setTimeout(() => {
            switch (phase) {
                case "tablet-focus":
                    setPhase("tablet-clicking");
                    break;
                case "tablet-clicking":
                    setPhase("statusboard-focus");
                    break;
                case "statusboard-focus":
                    setBlinkingStation(currentExam.stationId);
                    setPhase("statusboard-blink");
                    break;
                case "statusboard-blink":
                    setShowNextUpdate(true);
                    setPhase("statusboard-update");
                    break;
                case "statusboard-update":
                    setPhase("tts-announce");
                    break;
                case "tts-announce":
                    setBlinkingStation(null);
                    setShowNextUpdate(false);
                    setCurrentStep((prev) => (prev + 1) % EXAM_SCENARIOS.length);
                    setPhase("tablet-focus");
                    break;
            }
        }, timings[phase]);

        return () => clearTimeout(timer);
    }, [phase, currentExam.stationId, isActive, EXAM_SCENARIOS.length]);

    const isTabletFront = phase === "tablet-focus" || phase === "tablet-clicking";

    const content = (
        <div className="w-full h-full relative overflow-hidden">
            {/* Base Background Decor Removed */}
            
            {/* Status Board - positioned to bottom-right */}
            <motion.div
                className="absolute rounded-xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] border border-white overflow-hidden ring-1 ring-slate-200"
                animate={{
                    top: isTabletFront ? '12%' : '3%',
                    left: isTabletFront ? '12%' : '3%',
                    width: isTabletFront ? '76%' : '94%',
                    height: '85%',
                    zIndex: isTabletFront ? 10 : 30,
                    scale: isTabletFront ? 0.92 : 1,
                    filter: isTabletFront ? 'brightness(0.95) blur(2px)' : 'brightness(1) blur(0px)',
                }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
            >
                <StatusBoard 
                    boardState={BOARD_STATE}
                    blinkingStation={blinkingStation}
                    blinkToggle={blinkToggle}
                    showNextUpdate={showNextUpdate}
                    currentExam={currentExam}
                />
            </motion.div>

            {/* Tablet Screen - positioned to top-left */}
            <motion.div
                className="absolute rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] border border-white overflow-hidden ring-1 ring-slate-200"
                style={{ width: '82%', height: '85%' }}
                animate={{
                    top: isTabletFront ? '5%' : '12%',
                    left: isTabletFront ? '4%' : '15%',
                    zIndex: isTabletFront ? 30 : 10,
                    scale: isTabletFront ? 1 : 0.92,
                    filter: isTabletFront ? 'brightness(1) blur(0px)' : 'brightness(0.95) blur(2px)',
                }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
            >
                <TabletScreen 
                    currentExam={currentExam}
                    patientList={PATIENT_LIST}
                    phase={phase}
                />
            </motion.div>

            {/* TTS Speech Bubble */}
            <AnimatePresence>
                {phase === "tts-announce" && (
                    <TTSAnnouncement ttsText={currentExam.ttsText} />
                )}
            </AnimatePresence>


        </div>
    );

    if (isEmbedded) {
        return (
            <div 
                className={`w-full h-full ${className || ''}`}
                style={{ transform: `scale(${currentScale})`, transformOrigin: 'center' }}
            >
                {content}
            </div>
        );
    }

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 ring-1 ring-blue-100">
                        {tExam('automationLabel')}
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                        {tExam('title')}
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: tExam.raw('description') }} />
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-[900px] aspect-[16/10] relative group">
                        <BrowserFrame url="cohort.dashboard.local" className="w-full h-full" uiScale={1}>
                            {content}
                        </BrowserFrame>
                    </div>
                </div>
            </div>
        </section>
    );
}

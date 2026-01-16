"use client";

import { useTranslations } from "next-intl";
import { BoardState, ExamEvent, SnsbcRoom } from "@/types";

interface StatusBoardProps {
    boardState: BoardState;
    blinkingStation: string | null;
    blinkToggle: boolean;
    showNextUpdate: boolean;
    currentExam: ExamEvent;
}

export function StatusBoard({ 
    boardState, 
    blinkingStation, 
    blinkToggle, 
    showNextUpdate, 
    currentExam 
}: StatusBoardProps) {
    const t = useTranslations("CohortDashboard");

    return (
        <div className="w-full h-full flex flex-col bg-white font-sans overflow-hidden rounded-md">
            {/* Browser-like Address Bar - Safari style */}
            <div className="shrink-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 px-3 py-1">
                <div className="flex items-center bg-white rounded-md border border-gray-200 px-2 py-0.5">
                    <svg className="w-3 h-3 text-green-500 mr-1.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1 text-xs text-gray-600">{t('ExamFlow.StatusBoard.header')}</span>
                    <svg className="w-3 h-3 text-gray-400 ml-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>

            {/* SNSB-C Header */}
            <div className="shrink-0 py-1 text-center border-b-2 border-gray-200">
                <span className="text-[#2c5c8e] font-bold text-xl">SNSB-C</span>
            </div>

            {/* Exam Rooms Section (SNSB-C 1, 2, 3) */}
            <div className="flex border-b-2 border-gray-200 shrink-0" style={{ height: '32%' }}>
                {boardState.snsbcRooms.map((room: SnsbcRoom) => {
                    const roomId = `snsbc-${room.roomNum}`;
                    const isBlinking = blinkingStation === roomId;
                    const showAsActive = isBlinking ? blinkToggle : true;
                    
                    return (
                        <div 
                            key={room.roomNum}
                            className="flex-1 flex flex-col justify-center items-center border-r border-gray-200 last:border-r-0 p-1"
                            style={{ 
                                background: showAsActive 
                                    ? 'linear-gradient(to bottom, #4c8fbd 0%, #2c5c8e 100%)'
                                    : '#ffffff',
                                transition: isBlinking ? 'background 0.2s ease' : 'none'
                            }}
                        >
                            <div 
                                className="text-sm font-bold"
                                style={{ 
                                    color: showAsActive ? '#ffffff' : '#2c5c8e',
                                    transition: isBlinking ? 'color 0.2s ease' : 'none'
                                }}
                            >
                                {room.roomNum}{t('ExamFlow.StatusBoard.roomSuffix')}
                            </div>
                            <div 
                                className="text-3xl font-bold"
                                style={{ 
                                    color: showAsActive ? '#ffffff' : '#333',
                                    transition: isBlinking ? 'color 0.2s ease' : 'none'
                                }}
                            >
                                {isBlinking && showNextUpdate
                                    ? (currentExam.type === "start" ? currentExam.currentPerson : "-")
                                    : room.current
                                }
                            </div>
                            <div 
                                className="text-sm"
                                style={{ 
                                    color: showAsActive ? 'rgba(255,255,255,0.8)' : '#666',
                                    transition: isBlinking ? 'color 0.2s ease' : 'none'
                                }}
                            >
                                {room.time}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Next Subject Section (for SNSB-C) */}
            <div className="shrink-0 py-1 text-center border-b-2 border-gray-200 bg-white">
                <span className="text-gray-500 text-sm font-bold mr-1">{t('ExamFlow.StatusBoard.next')}</span>
                <span 
                    className="text-[#2c5c8e] text-xl font-bold"
                >
                    {boardState.snsbcRooms[0].next}
                </span>
            </div>

            {/* Test Stations Section (심전도, 채혈/채뇨, 신체기능) */}
            <div className="flex flex-1 min-h-0">
                {[
                    { id: 'ecg', title: t('Bottleneck.exams.ecg'), data: boardState.stations.ecg },
                    { id: 'blood', title: t('Bottleneck.exams.blood'), data: boardState.stations.blood },
                    { id: 'physical', title: t('Bottleneck.exams.body'), data: boardState.stations.physical }
                ].map((station) => {
                    const isActive = station.data.current !== null;
                    const isBlinking = blinkingStation === station.id;
                    
                    const showAsActive = isBlinking ? (blinkToggle ? !isActive : isActive) : isActive;
                    
                    const bgStyle = showAsActive 
                        ? 'linear-gradient(to bottom, #4c8fbd 0%, #2c5c8e 100%)' 
                        : '#ffffff';
                    const titleBg = showAsActive ? 'rgba(255,255,255,0.1)' : '#f3f4f6';
                    const titleColor = showAsActive ? '#ffffff' : '#2c5c8e';
                    const textColor = showAsActive ? '#ffffff' : '#333333';
                    const subTextColor = showAsActive ? 'rgba(255,255,255,0.8)' : '#666666';
                    const nextBoxBg = showAsActive 
                        ? '#ffffff' 
                        : 'linear-gradient(to bottom, #4c8fbd 0%, #2c5c8e 100%)';
                    const nextLabelColor = showAsActive ? '#6b7280' : 'rgba(255,255,255,0.8)';
                    const nextNameColor = showAsActive ? '#2c5c8e' : '#ffffff';
                    
                    return (
                        <div 
                            key={station.id}
                            className="flex-1 flex flex-col border-r border-gray-200 last:border-r-0 p-1.5"
                            style={{ 
                                background: bgStyle,
                                transition: isBlinking ? 'background 0.2s ease' : 'none'
                            }}
                        >
                            {/* Station Title */}
                            <div 
                                className="text-center text-sm font-bold py-1 rounded"
                                style={{ 
                                    backgroundColor: titleBg, 
                                    color: titleColor,
                                    transition: isBlinking ? 'all 0.2s ease' : 'none'
                                }}
                            >
                                {station.title}
                            </div>

                            {/* Current Person */}
                            <div className="flex-1 flex flex-col justify-center items-center">
                                <div 
                                    className="text-3xl font-bold"
                                    style={{ 
                                        color: textColor,
                                        transition: isBlinking ? 'color 0.2s ease' : 'none'
                                    }}
                                >
                                    {isBlinking && showNextUpdate
                                        ? (currentExam.type === "start" ? currentExam.currentPerson : "-")
                                        : (station.data.current || '-')
                                    }
                                </div>
                                <div 
                                    className="text-sm"
                                    style={{ 
                                        color: subTextColor,
                                        transition: isBlinking ? 'color 0.2s ease' : 'none'
                                    }}
                                >
                                    {station.data.time}
                                </div>
                            </div>

                            {/* Next Person Box */}
                            <div 
                                className="py-1 px-2 mx-4 mb-1.5 text-center rounded"
                                style={{ 
                                    background: nextBoxBg,
                                    transition: isBlinking ? 'background 0.2s ease' : 'none'
                                }}
                            >
                                <div 
                                    className="text-xs font-bold"
                                    style={{ 
                                        color: nextLabelColor,
                                        transition: isBlinking ? 'color 0.2s ease' : 'none'
                                    }}
                                >
                                    {t('ExamFlow.StatusBoard.next')}
                                </div>
                                <div 
                                    className="text-lg font-bold"
                                    style={{ 
                                        color: nextNameColor,
                                        transition: isBlinking ? 'color 0.2s ease' : 'none'
                                    }}
                                >
                                    {isBlinking && showNextUpdate
                                        ? (currentExam.type === "complete" ? currentExam.nextPerson : "-")
                                        : (station.data.next || t('ExamFlow.StatusBoard.noSubject'))
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

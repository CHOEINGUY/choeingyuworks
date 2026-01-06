import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFirebaseSession } from '../hooks/useFirebaseSession';
import { useSessionData } from '../hooks/useSessionData';
import { db } from '../firebase';
import { collection, query, where, getDocs, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';

import Timer from '../components/Timer';
import ManualEntryAuth from '../components/session/ManualEntryAuth';
import SessionLoading from '../components/session/SessionLoading';
import SessionStatusWaiting from '../components/session/SessionStatusWaiting';
import SessionLiveView from '../components/session/SessionLiveView';
import SessionBreakView from '../components/session/SessionBreakView';
import SessionSelectionView from '../components/session/SessionSelectionView';
import SessionEndView from '../components/session/SessionEndView';

import { Clock, UserX } from 'lucide-react';
import { User } from '../types';
import { toast } from 'sonner';
import PageTitle from '../components/common/PageTitle';


const Session: React.FC = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('key');

    const [mySessionId, setMySessionId] = useState<string | null>(null);

    // Fetch User's Session ID
    useEffect(() => {
        const fetchUserSession = async () => {
            if (!userId) return;
            try {
                const userDocRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData.sessionId && userData.sessionId !== mySessionId) {
                        setMySessionId(userData.sessionId);
                    }
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
            }
        };
        fetchUserSession();
    }, [userId]);

    const { status, timeLeft, currentRound, config, loading: sessionLoading } = useFirebaseSession(mySessionId || "unassigned");

    const [feedbackData, setFeedbackData] = useState<Record<string, any>>({});
    const { usersData, dataLoading, partner, nextPartner, totalRounds, rotationsData } = useSessionData(mySessionId, userId, currentRound);

    const [isSelectionDone, setIsSelectionDone] = useState(false);
    const [isSelectionReady, setIsSelectionReady] = useState(false);
    const [isWaitingForNextRound, setIsWaitingForNextRound] = useState(false);
    const [_isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
    const [isFeedbackExiting, setIsFeedbackExiting] = useState(false);

    // Reset waiting state when round changes or status switches
    useEffect(() => {
        if (status === 'LIVE' || status === 'SELECTION') {
            setIsWaitingForNextRound(false);
            setIsFeedbackSubmitted(false);
            setIsFeedbackExiting(false);
        }
    }, [currentRound, status]);

    useEffect(() => {
        const fetchMyFeedbacks = async () => {
            if (status === 'SELECTION' && userId) {
                try {
                    const q = query(
                        collection(db, 'feedbacks'),
                        where('fromUserId', '==', userId),
                        where('sessionId', '==', mySessionId)
                    );
                    const querySnapshot = await getDocs(q);
                    const loadedFeedbacks: Record<string, any> = {};
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        loadedFeedbacks[data.toUserId] = { rating: data.rating, note: data.note };
                    });

                    setFeedbackData(prev => ({ ...prev, ...loadedFeedbacks }));
                } catch (error) {
                    console.error("Error loading feedbacks:", error);
                }
            }
        };
        fetchMyFeedbacks();
    }, [status, userId]);

    const handleFeedbackSubmit = async (data: any) => {
        if (partner && userId && mySessionId) {
            setFeedbackData(prev => ({
                ...prev,
                [partner.id]: data
            }));

            try {
                const feedbackId = `${mySessionId}_${userId}_${partner.id}`;
                await setDoc(doc(db, 'feedbacks', feedbackId), {
                    sessionId: mySessionId,
                    fromUserId: userId,
                    toUserId: partner.id,
                    rating: data.rating,
                    note: data.note,
                    tags: data.tags || [],
                    round: currentRound,
                    timestamp: serverTimestamp()
                });

                setIsFeedbackSubmitted(true);
                setTimeout(() => setIsFeedbackExiting(true), 4000);
                setTimeout(() => {
                    setIsWaitingForNextRound(true);
                    setIsFeedbackSubmitted(false);
                    setIsFeedbackExiting(false);
                }, 5000);
            } catch (error) {
                console.error("Failed to save feedback:", error);
                toast.error("평가 저장 실패! 인터넷 연결을 확인해주세요.");
            }
        }
    };

    const handleSelectionChange = (isReady: boolean) => {
        setIsSelectionReady(isReady);
    };

    const handleSelectionSubmit = async (selectedIds: string[]) => {
        if (!userId || !mySessionId) return;
        try {
            const selectionId = `${mySessionId}_${userId}`;
            await setDoc(doc(db, 'selections', selectionId), {
                sessionId: mySessionId,
                userId: userId,
                selectedPartnerIds: selectedIds,
                timestamp: serverTimestamp()
            });
            setIsSelectionDone(true);
        } catch (error) {
            console.error("Failed to save selection:", error);
            toast.error("선택 저장 실패! 다시 시도해주세요.");
        }
    };

    const themeMode = config?.themeMode || 'day';
    const themeStyle = config?.themeStyle || 'standard';

    const bgClass = (() => {
        if (themeStyle === 'glass') {
            return themeMode === 'night'
                ? 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-900'
                : 'bg-gradient-to-br from-blue-50 via-white to-pink-50';
        }
        if (themeMode === 'night') return 'bg-slate-950';
        if (status === 'BREAK') return 'bg-indigo-950';
        if (status === 'SELECTION' && isSelectionReady && !isSelectionDone) {
            const g = (userId && usersData && usersData[userId]) ? usersData[userId].gender : '';
            return g === 'M' ? 'bg-blue-950' : 'bg-indigo-950';
        }
        const g = (userId && usersData && usersData[userId]) ? usersData[userId].gender : '';
        if (g === 'M') return 'bg-blue-50/30';
        if (g === 'F') return 'bg-pink-50/30';
        return 'bg-gray-50';
    })();

    const isDarkHeader = status === 'BREAK' || (status === 'SELECTION' && isSelectionReady && !isSelectionDone);

    const [minLoading, setMinLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setMinLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!userId) return <ManualEntryAuth usersData={usersData || undefined} />;
    if (sessionLoading || (dataLoading && mySessionId) || minLoading) return <SessionLoading dataLoading={dataLoading} />;

    if (!mySessionId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-sm text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserX className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">배정된 세션이 없습니다</h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        현재 참여 중인 세션 정보를 찾을 수 없습니다.<br />
                        관리자에게 문의하거나 다시 로그인해주세요.
                    </p>
                    <button onClick={() => window.location.reload()} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-colors">
                        다시 시도하기
                    </button>
                </div>
            </div>
        );
    }

    const myGender = (usersData && usersData[userId]) ? usersData[userId].gender : undefined;

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-700 ease-in-out flex flex-col`}>
            <PageTitle title="세션 | Rotation Dating" />
            <header className={`px-6 pt-6 ${status === 'SELECTION' ? 'pb-1' : 'pb-6'} flex justify-between items-center ${themeMode === 'night' || isDarkHeader ? 'text-white' : 'text-gray-900'}`}>

                <div>
                    <h2 className="font-bold text-lg opacity-90">Random Dating</h2>
                    <p className="text-sm opacity-70 font-medium">
                        {status === 'LIVE' ? '💕 대화 진행 중' :
                            status === 'BREAK' ? '📝 설렘 기록' :
                                status === 'SELECTION' ? '👑 최종 선택' :
                                    status === 'WAITING' ? '⏳ 대기 중' : '🏁 종료됨'}
                    </p>
                </div>
                {status !== 'ENDED' && status !== 'SELECTION' && (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isDarkHeader ? 'bg-white/10' : 'bg-black/5'}`}>
                        <Clock size={16} className="opacity-70" />
                        <span className="font-mono font-bold">Round {Math.min(currentRound, totalRounds)}/{totalRounds}</span>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full relative">
                {status !== 'ENDED' && status !== 'SELECTION' && status !== 'WAITING' && !isWaitingForNextRound && (
                    <div className={`mb-2 min-h-[144px] flex flex-col justify-center transition-all duration-1000 ${isFeedbackExiting ? 'opacity-0 blur-sm scale-95' : 'opacity-100'}`}>
                        <Timer
                            timeLeft={Math.max(0, timeLeft)}
                            maxTime={status === 'LIVE' ? config.roundDuration : config.breakDuration}
                            darkMode={status === 'BREAK' || themeMode === 'night'}
                        />
                    </div>
                )}

                <div className="flex-1 relative mt-2">
                    {status === 'WAITING' && (
                        <SessionStatusWaiting
                            userName={usersData?.[userId]?.name}
                            themeMode={themeMode}
                            userId={userId}
                        />
                    )}

                    {status === 'LIVE' && (
                        <SessionLiveView
                            partner={partner}
                            themeMode={themeMode as 'day' | 'night'}
                            themeStyle={themeStyle as 'standard' | 'glass'}
                            myGender={myGender as 'M' | 'F' | undefined}
                            dataLoading={dataLoading}
                            rotationsData={rotationsData}
                        />
                    )}

                    {status === 'BREAK' && (
                        <SessionBreakView
                            partner={partner}
                            isWaitingForNextRound={isWaitingForNextRound}
                            isFeedbackExiting={isFeedbackExiting}
                            onSubmitFeedback={handleFeedbackSubmit}
                            themeMode={themeMode as 'day' | 'night'}
                            themeStyle={themeStyle as 'standard' | 'glass'}
                            currentRound={currentRound}
                            totalRounds={totalRounds}
                            nextPartner={nextPartner}
                        />
                    )}

                    {status === 'SELECTION' && (
                        <SessionSelectionView
                            isSelectionDone={isSelectionDone}
                            onSubmitSelection={handleSelectionSubmit}
                            onSelectionChange={handleSelectionChange}
                            feedbackData={feedbackData}
                            myGender={myGender as 'M' | 'F' | undefined}
                            usersData={usersData as Record<string, User> | null}
                            userId={userId}
                        />
                    )}

                    <SessionEndView
                        status={status}
                        isSelectionDone={isSelectionDone}
                        myGender={myGender as 'M' | 'F' | undefined}
                        usersData={usersData}
                        userId={userId}
                        mySessionId={mySessionId}
                    />
                </div>
            </main>
        </div>
    );
};

export default Session;

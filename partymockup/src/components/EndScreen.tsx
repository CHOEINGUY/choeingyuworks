import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Heart, PartyPopper, Users } from 'lucide-react';
import { User } from '../types';

interface EndScreenProps {
    gender: 'M' | 'F' | string;
    usersData: Record<string, User>;
    currentUserId: string;
    sessionId?: string;
}

const EndScreen: React.FC<EndScreenProps> = ({ gender, usersData, currentUserId, sessionId }) => {
    // If sessionId not passed, fallback (shouldn't happen with correct usage but safe default)
    const targetSessionId = sessionId || 'demo-session';
    const userId = currentUserId;

    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState<User[]>([]);
    const [mySelections, setMySelections] = useState<string[]>([]);

    useEffect(() => {
        if (!usersData) return;

        setLoading(true);

        const q = query(collection(db, 'selections'), where('sessionId', '==', targetSessionId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const allSelections: Record<string, string[]> = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                allSelections[data.userId] = data.selectedPartnerIds || [];
            });

            // 2. Determine matches
            const myPickedIds = allSelections[userId] || [];
            setMySelections(myPickedIds);

            const mutualMatches: User[] = [];
            myPickedIds.forEach(partnerId => {
                const partnerPickedIds = allSelections[partnerId] || [];
                if (partnerPickedIds.includes(userId)) {
                    // Use usersData from prop
                    if (usersData[partnerId]) {
                        mutualMatches.push(usersData[partnerId]);
                    }
                }
            });

            setMatches(mutualMatches);
            setLoading(false);
        }, (error) => {
            console.error("Error watching matches:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId, usersData, targetSessionId, gender]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-bounce" fill="currentColor" />
                    <h2 className="text-xl font-bold text-gray-800">두구두구... 결과 확인 중!</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            {matches.length > 0 ? (
                <>
                    <div className="relative mb-6">
                        <div className="absolute -top-6 -left-6 animate-bounce delay-100">
                            <PartyPopper className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="absolute -top-6 -right-6 animate-bounce delay-300">
                            <PartyPopper className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h2 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                            축하합니다!
                        </h2>
                    </div>

                    <p className="text-gray-600 mb-8 font-medium">
                        <span className="text-pink-600 font-bold">{matches.length}명</span>과 마음이 통했어요!
                    </p>

                    <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                        {matches.map(partner => (
                            <div key={partner.name} className="bg-white rounded-2xl p-4 shadow-xl border-2 border-pink-100 flex items-center gap-4 transform transition-all hover:scale-105">
                                {partner.avatar ? (
                                    <img
                                        src={partner.avatar}
                                        className="w-16 h-16 rounded-full border-2 border-pink-200 bg-white object-cover"
                                        alt={partner.name}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full border-2 border-pink-200 bg-white flex items-center justify-center">
                                        <Users size={24} className="text-pink-300" />
                                    </div>
                                )}
                                <div className="text-left">
                                    <h3 className="font-bold text-lg text-gray-800">{partner.name}님</h3>
                                    <p className="text-xs text-pink-500 font-medium">서로를 선택하셨습니다! 💕</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-6 opacity-80">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        매칭된 상대가 없습니다
                    </h2>
                    <p className="text-gray-500 text-sm max-w-xs break-keep">
                        아쉽게도 마음이 통한 상대가 없네요.<br />
                        다음 기회에 더 좋은 인연을 만나실 거예요!
                    </p>
                    <div className="mt-8 text-xs text-gray-400">
                        내가 선택한 사람: {mySelections.map(id => usersData?.[id]?.name).join(', ') || '없음'}
                    </div>
                </>
            )}
        </div>
    );
};
export default EndScreen;

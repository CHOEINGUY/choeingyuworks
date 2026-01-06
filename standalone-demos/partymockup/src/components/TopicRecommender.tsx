import React, { useState } from 'react';
import { MessageCircle, X, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

const TOPICS = [
    "최근에 갔던 여행지 중 가장 좋았던 곳은?",
    "가장 좋아하는 음식이나 맛집 추천해주세요!",
    "요즘 즐겨보는 유튜브 채널이나 넷플릭스 드라마 있나요?",
    "주말에는 주로 무엇을 하며 시간을 보내시나요?",
    "만약 로또 1등에 당첨된다면 가장 먼저 하고 싶은 일은?",
    "학창시절에 어떤 학생이었나요?",
    "가장 좋아하는 계절과 그 이유는?",
    "살면서 가장 기억에 남는 특별한 경험이 있나요?",
    "나만의 스트레스 해소법이 있다면?",
    "가장 좋아하는 영화 장르나 인생 영화는?",
    "못 먹는 음식이나 알러지가 있나요?",
    "아침형 인간인가요, 저녁형 인간인가요?",
    "최근에 산 물건 중에 가장 만족스러운 것은?",
    "가장 좋아하는 색깔은?",
    "탕수육은 부먹 vs 찍먹?",
    "민트초코 좋아하시나요? (호 vs 불호)",
    "죽기 전에 꼭 해보고 싶은 버킷리스트 1위는?",
    "어렸을 때 장래희망이 뭐였나요?",
    "가장 좋아하는 디저트는?",
    "강아지상 vs 고양이상, 어느 쪽을 더 좋아하시나요?",
    "쉬는 날엔 집순이/집돌이 vs 밖으로 나가야 한다?",
    "가장 좋아하는 아이스크림 맛은?",
    "노래방 가는 거 좋아하시나요? 애창곡은?",
    "최근에 본 영화 중 재미있었던 건?",
    "1년 동안 휴가가 주어진다면 어디서 뭘 하고 싶나요?",
    "나만 아는 숨겨진 맛집이 있나요?",
    "커피 vs 차, 어느 쪽을 선호하시나요?",
    "가장 좋아하는 계절 스포츠가 있나요? (스키, 수영 등)",
    "낯가림이 심한 편인가요, 아니면 금방 친해지는 편인가요?",
    "MBTI가 어떻게 되세요?",
    "연락은 카톡 vs 전화, 어느 쪽을 선호하시나요?",
    "소개팅이나 데이트 할 때 선호하는 메뉴는?",
    "인생에서 가장 큰 일탈을 해본 경험은?",
    "나중에 꼭 배워보고 싶은 취미가 있나요?",
    "가장 좋아하는 동물은?",
    "여름 휴가는 바다 vs 계곡 vs 호캉스?",
    "붕어빵은 머리부터 vs 꼬리부터?",
    "가장 자주 사용하는 스마트폰 앱은?",
    "비 오는 날을 좋아하시나요?",
    "요리하는 걸 좋아하시나요? 자신 있는 요리는?",
    "좋아하는 술 종류나 주량은 어떻게 되세요?",
    "카페 가면 주로 뭐 시키세요?",
    "잠들기 전에 마지막으로 하는 일은?",
    "가장 싫어하는 음식은?",
    "약속 시간에 칼같이 지키는 편 vs 조금 늦는 편?",
    "좋아하는 가수가 있나요?",
    "친구들이 말하는 나의 첫인상은?",
    "이상형에 가까운 연예인이 있다면?",
    "가장 감명 깊게 읽은 책은?",
    "오늘 기분은 10점 만점에 몇 점?"
];

interface TopicRecommenderProps {
    gender?: string;
    themeMode?: string;
}

const TopicRecommender: React.FC<TopicRecommenderProps> = ({ gender = 'F', themeMode = 'day' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % TOPICS.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + TOPICS.length) % TOPICS.length);
    };

    const handleRandom = () => {
        const randomIndex = Math.floor(Math.random() * TOPICS.length);
        setCurrentIndex(randomIndex);
    };

    // Dynamic Theme Colors
    const isMale = gender === 'M';
    const isDark = themeMode === 'night';

    // Floating Button
    const buttonClass = isDark
        ? (isMale
            ? "bg-slate-800 text-blue-400 border-2 border-slate-700 hover:border-blue-500"
            : "bg-slate-800 text-pink-400 border-2 border-slate-700 hover:border-pink-500")
        : (isMale
            ? "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-300"
            : "bg-white text-pink-600 border-2 border-pink-100 hover:border-pink-300");

    // Modal Card
    const modalContainerBg = isDark ? "bg-slate-800" : "bg-white";
    const modalTitleColor = isDark ? "text-white" : "text-gray-800";

    // Topic Card inside Modal
    const modalBgClass = isDark
        ? (isMale ? "bg-blue-900/30 border-blue-800" : "bg-pink-900/30 border-pink-800")
        : (isMale ? "bg-blue-50 border-blue-100" : "bg-pink-50 border-pink-100");

    const quoteClass = isMale
        ? (isDark ? "text-blue-500" : "text-blue-300")
        : (isDark ? "text-pink-500" : "text-pink-300");

    const topicTextColor = isDark ? "text-gray-100" : "text-gray-800";

    const randomBtnClass = isMale
        ? (isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600 hover:shadow-blue-200")
        : (isDark ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600 hover:shadow-pink-200");

    const navBtnClass = isDark
        ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
        : "bg-gray-100 hover:bg-gray-200 text-gray-600";

    const closeBtnClass = isDark
        ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200";

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 shadow-lg rounded-full px-5 py-3 font-bold flex items-center gap-2 transition-all active:scale-95 hover:shadow-xl z-50 ${buttonClass}`}
            >
                <MessageCircle size={20} />
                <span className="text-sm">대화주제 추천</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className={`${modalContainerBg} w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-300 flex flex-col items-center transition-colors`}>

                        {/* Header */}
                        <div className="w-full flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-bold flex items-center gap-2 ${modalTitleColor}`}>
                                <span className="text-2xl">💡</span> 아이스브레이킹
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`p-2 rounded-full transition-colors ${closeBtnClass}`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Card Content (Slideshow) */}
                        <div className={`w-full rounded-3xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center relative mb-6 shadow-inner border transition-all ${modalBgClass}`}>
                            <span className={`absolute top-4 left-4 text-4xl font-serif ${quoteClass}`}>"</span>
                            <p className={`${topicTextColor} font-bold text-lg leading-relaxed px-2 animate-in fade-in zoom-in duration-300`} key={currentIndex}>
                                {TOPICS[currentIndex]}
                            </p>
                            <span className={`absolute bottom-4 right-4 text-4xl font-serif rotate-180 ${quoteClass}`}>"</span>
                        </div>

                        {/* Controls */}
                        <div className="w-full flex items-center justify-between gap-4">
                            <button
                                onClick={handlePrev}
                                className={`p-4 rounded-full active:scale-95 transition-all ${navBtnClass}`}
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                onClick={handleRandom}
                                className={`flex-1 py-4 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${randomBtnClass}`}
                            >
                                <Shuffle size={18} />
                                랜덤 주제
                            </button>

                            <button
                                onClick={handleNext}
                                className={`p-4 rounded-full active:scale-95 transition-all ${navBtnClass}`}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="mt-4 text-xs text-gray-400 font-mono">
                            {currentIndex + 1} / {TOPICS.length}
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
export default TopicRecommender;

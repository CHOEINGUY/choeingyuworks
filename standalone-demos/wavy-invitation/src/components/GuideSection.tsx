import React from 'react';
import { motion } from 'framer-motion';
import { Schedule } from '../utils/schedule';
import BottomSheet from './BottomSheet';
import Footer from './Footer';
import { useRegion } from '../hooks/useRegion';

interface GuideSectionProps {
    scheduleData: Schedule | null;
}

const GuideSection: React.FC<GuideSectionProps> = ({ scheduleData }) => {
    const region = useRegion();
    // We can let BottomSheet handle the state, but if we want to change the handle text  
    // based on state, we might need to lift state up or use a render prop.
    // For simplicity with the new framer-motion setup which uses internal useAnimation, 
    // let's pass the "Peek" handle. The "Close" handle will be part of the *children* (top of content) 
    // or we just rely on tapping the peek handle (which toggles).

    // Current design:
    // Peek: "SWIPE UP FOR GUIDE"
    // Open: "CLOSE GUIDE"

    // Since my new BottomSheet uses internal state for animation controls, 
    // syncing external state might be tricky without `useEffect`.
    // Let's modify BottomSheet.tsx in the NEXT step if needed, but for now 
    // I will render the "SWIPE UP" handle as the persistent handle. 
    // When open, it will still be at the top of the sheet (which slides up).
    // So modifying the text requires knowing the state.

    return (
        <section className="w-full h-[85px] relative z-20 pointer-events-none">
            <BottomSheet
                peekHeight={85}
                handleContent={
                    <div className="w-full bg-[#111] rounded-t-[24px] shrink-0 touch-none select-none h-[85px] border-t border-zinc-800 shadow-2xl relative z-50 transition-transform hover:brightness-110 flex flex-col items-center justify-center overflow-hidden">
                        {/* Shimmer Effect Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                        {/* Pull Indicator Bar */}
                        <div className="w-12 h-1.5 rounded-full bg-zinc-600 mb-2" />

                        {/* Bouncing Content */}
                        <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="flex flex-col items-center"
                        >
                            {/* Chevron Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-white/90 mb-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>

                            <p className="text-zinc-200 text-xs tracking-widest uppercase font-light">
                                입장 전 필독 안내
                            </p>
                        </motion.div>
                    </div>
                }
            >
                {/* Content */}
                <div className="bg-[#111] pt-1 pb-4 pb-[calc(1rem+env(safe-area-inset-bottom))] px-6 min-h-screen text-white text-left">
                    <div className="mb-8 mt-4 text-center">
                        <h2 className="text-white text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">WAVY 파티 가이드</h2>
                        <p className="text-zinc-400 text-sm mt-2 font-light">
                            안녕하세요, WAVY입니다. 오늘은 일상은 OFF, 설렘은 ON.<br />
                            부드러운 진행을 위해 아래 안내만 확인해주세요.
                        </p>
                    </div>

                    <div className="space-y-10 pb-10">
                        {/* Section 1: 입장 전 필독 안내 */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2 text-xl">✅</span> 입장 전 필독 안내
                            </h3>
                            <ul className="space-y-2 text-zinc-300 text-sm leading-relaxed">
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>현장 스냅은 공식 SNS에 업로드될 수 있어요. 얼굴은 예쁘게 모자이크 처리됩니다.</span>
                                </li>
                                <li className="flex items-start text-pink-400 font-medium">
                                    <span className="text-pink-400 mr-2">•</span>
                                    <span>지각은 손해! {scheduleData?.start === 20 ? '19:50' : '18:50'} 전 도착을 권장해요. 늦으면 첫 만남을 놓칠 수 있어요.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>식사는 미리 하고 오세요. 간단한 안주만 제공됩니다.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>
                                        {region.name === 'daegu'
                                            ? '여자 화장실은 지하 1층, 남자 화장실은 지상 1층에 있습니다.'
                                            : '화장실은 2층 테라스에 있습니다.'}
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>흡연은 화장실 반대편 거울 옆 작은 통로에서만 가능합니다.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>음주는 컨디션에 맞게! 힘들면 언제든 쉴 수 있어요.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>주차가 매우 어려우니 대중교통 이용을 권장합니다.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>남에게 피해를 주는 행위는 제재 대상이며, 심각할 경우 퇴장 조치될 수 있습니다.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>물품 파손/분실은 본인 책임입니다.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>환불 요건: 행사 7일 전까지 100% 환불 가능합니다.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 2: WAVY 파티 기본 룰 */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2 text-xl">📋</span> WAVY 파티 기본 룰
                            </h3>
                            <ul className="space-y-2 text-zinc-300 text-sm leading-relaxed">
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>1시간마다 로테이션으로 자리가 변경됩니다. 해당 시간엔 자리를 지켜주세요.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>빈 병은 수거함에, 추가 주류는 셀프로 이용해주세요.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>앱이나 스탭을 통해 언제든 ‘익명 편지’를 보낼 수 있어요.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-zinc-600 mr-2">•</span>
                                    <span>2차 파티에서 서로 지목되면 매칭 성공! 작은 선물도 드려요.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 3: 로테이션 안내 */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2 text-xl">⏱</span> 로테이션 안내
                            </h3>
                            <p className="text-zinc-300 text-sm leading-relaxed p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                                {scheduleData?.rotation || '로테이션 시간은 현장 상황에 따라 안내됩니다.'}
                            </p>
                        </section>

                        {/* Section 4: 1차 파티 */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                                <span className="mr-2 text-xl">🤝</span> 1차 파티
                            </h3>
                            <p className="text-zinc-400 text-xs mb-4">우리는 지금 서로 알아가고 있는 중… 가벼운 게임과 대화로 시작해요.</p>
                            <ul className="space-y-3">
                                {scheduleData?.party1.map((item, idx) => (
                                    <li key={idx} className="flex text-sm">
                                        <span className="text-purple-400 font-medium w-24 shrink-0">{item.time}</span>
                                        <span className="text-zinc-300">{item.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Section 5: 2차 파티 */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                                <span className="mr-2 text-xl">🔥</span> 2차 파티
                            </h3>
                            <p className="text-zinc-400 text-xs mb-4">도파민 터지는 설렘 타임. 마음이 향하는 곳으로 한 걸음 더.</p>
                            <ul className="space-y-3">
                                {scheduleData?.party2.map((item, idx) => (
                                    <li key={idx} className="flex text-sm">
                                        <span className="text-pink-400 font-medium w-24 shrink-0">{item.time}</span>
                                        <span className="text-zinc-300">{item.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Section 6: 익명 편지 */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2 text-xl">💌</span> 익명 편지 안내
                            </h3>
                            <p className="text-zinc-300 text-sm mb-4">말로 하긴 쑥스러울 때, 스탭이 당신의 마음을 몰래 전달해드려요.</p>

                            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-zinc-800 space-y-4">
                                <div>
                                    <p className="text-xs text-zinc-500 mb-1">예시 1</p>
                                    <div className="bg-white/5 p-3 rounded text-sm text-zinc-300 italic">
                                        "To. 카리나<br />
                                        이번 주말에 같이 카페 갈래요?<br />
                                        From. 박서준 (010-1234-5678)"
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 mb-1">예시 2</p>
                                    <div className="bg-white/5 p-3 rounded text-sm text-zinc-300 italic">
                                        "To. 다니엘<br />
                                        오늘 스타일 너무 멋지세요!<br />
                                        From. 윈터 (insta {region.instagram})"
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2 text-xl">🎁</span> 이벤트 안내
                            </h3>
                            <ul className="space-y-4 text-zinc-300 text-sm">
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    <div>
                                        <p className="font-medium text-white">사진/영상 제보 할인</p>
                                        <p className="text-zinc-400 text-xs mt-0.5">사진 10장 + 짧은 영상 1컷 제공 시 3,000원 할인</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    <div>
                                        <p className="font-medium text-white">블로그 후기 이벤트</p>
                                        <p className="text-zinc-400 text-xs mt-0.5 text-balance">정성스러운 블로그 리뷰 작성 시 입장권 20,000원 환급 (가이드 DM 문의)</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    <div>
                                        <p className="font-medium text-white">인스타 후기 이벤트</p>
                                        <p className="text-zinc-400 text-xs mt-0.5 text-balance">피드 또는 릴스 업로드 시 입장권 20,000원 환급 (가이드 DM 문의)</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    <div>
                                        <p className="font-medium text-white">지인 추천 이벤트 (중복 적용)</p>
                                        <p className="text-zinc-400 text-xs mt-0.5 text-balance">추천받아 온 지인 3,000원 할인 (신청서에 추천인 기입 필수)</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        {/* Section 8: 지금 할 일 */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                                <span className="mr-2 text-xl">🚀</span> 지금 할 수 있는 일
                            </h3>
                            <ul className="space-y-2 text-zinc-300 text-sm">
                                <li className="flex items-start">
                                    <span className="text-pink-500 mr-2">•</span>
                                    <span>현장 분위기 사진 미리 찍어두기</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-pink-500 mr-2">•</span>
                                    <span>떠오르는 지인에게 이 페이지 공유하기</span>
                                </li>
                            </ul>
                        </section>

                        <div className="pt-8 text-center">
                            <p className="text-zinc-500 text-xs">
                                WAVY 파티는 단순한 자리가 아니라,<br />
                                기억에 남을 설레는 추억이 되길 바랍니다.
                            </p>
                            <Footer />
                        </div>
                    </div>
                </div>
            </BottomSheet>
        </section >
    );
};

export default GuideSection;

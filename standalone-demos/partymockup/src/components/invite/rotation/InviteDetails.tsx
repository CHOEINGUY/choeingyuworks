import React, { ReactNode } from 'react';
import {
    Clock, MapPin, AlertCircle, Heart, Mail,
    Gift, Camera, LucideIcon
} from 'lucide-react';

interface SectionProps {
    title: string;
    icon?: LucideIcon;
    children: ReactNode;
    isLast?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children, isLast }) => (
    <div className={`space-y-4 ${!isLast ? 'pb-8 border-b border-slate-100 dark:border-slate-800' : ''}`}>
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            {Icon && <Icon size={20} className="text-indigo-500" />}
            <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {children}
        </div>
    </div>
);

interface BulletPointProps {
    text: string;
    highlight?: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({ text, highlight }) => (
    <div className="flex items-start gap-2.5">
        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
        <p>
            {highlight && <span className="font-bold text-slate-900 dark:text-white mr-1">{highlight}</span>}
            {text}
        </p>
    </div>
);

const InviteDetails: React.FC = () => {
    return (
        <div className="space-y-8 px-2 pb-10">
            {/* Intro */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl text-center space-y-2">
                <p className="font-bold text-indigo-900 dark:text-indigo-300">
                    "오늘은 일상은 OFF, 설렘은 ON"
                </p>
                <p className="text-sm text-indigo-700 dark:text-indigo-400">
                    안녕하세요, WAVY입니다.<br />
                    부드러운 진행을 위해 아래 내용을 꼭 확인해주세요.
                </p>
            </div>

            {/* 1. Essential Guide */}
            <Section title="입장 전 필독 (Must Read)" icon={AlertCircle}>
                <BulletPoint highlight="지각은 손해!" text="18:50 전 도착을 권장해요. 늦으면 첫 로테이션을 놓칠 수 있어요." />
                <BulletPoint highlight="식사는 미리" text="간단한 안주만 제공됩니다. 든든히 드시고 오세요." />
                <BulletPoint highlight="사진 촬영" text="현장 스냅은 공식 SNS에 올라갈 수 있어요. (얼굴은 예쁘게 모자이크 해드려요!)" />
                <BulletPoint highlight="주차 불가" text="광안리는 주차가 매우 어려워요. 대중교통을 강력 추천합니다." />
                <BulletPoint highlight="매너 준수" text="불쾌감을 주는 행위는 즉시 퇴장 조치됩니다. (환불 불가)" />
            </Section>

            {/* 2. Schedule */}
            <Section title="타임테이블 (Time Table)" icon={Clock}>
                <div className="pl-2 space-y-4 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                    {[
                        { time: '19:00', title: '입장 및 웰컴 드링크', desc: '설레는 첫 만남, 가볍게 몸을 녹이세요.' },
                        { time: '19:30', title: '1부 로테이션 대화', desc: '어색함 없이 자연스럽게, 모든 분들과 대화해요.' },
                        { time: '21:00', title: '2부 프리 네트워킹', desc: '가장 설레는 순간! 마음이 가는 곳으로 움직이세요.' },
                        { time: '23:00', title: '공식 파티 종료', desc: '아쉬움이 남는다면 뒷풀이까지?' }
                    ].map((item, i) => (
                        <div key={i} className="relative pl-6">
                            <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500" />
                            <p className="font-bold text-slate-900 dark:text-white">{item.time} <span className="font-normal text-sm ml-2">{item.title}</span></p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 3. Features */}
            <Section title="WAVY의 특별함" icon={Heart}>
                <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex gap-4 items-start">
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-full shrink-0 shadow-sm">
                            <Mail size={18} className="text-pink-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">익명 편지 (설렘 배달)</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">
                                말 걸기 쑥스럽다면? 스탭/앱을 통해 마음을 전해보세요. 몰래 전달해 드려요.
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex gap-4 items-start">
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-full shrink-0 shadow-sm">
                            <Gift size={18} className="text-purple-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">2차 매칭 & 선물</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">
                                서로 지목하여 매칭되면 성공! 작은 축하 선물도 준비되어 있어요.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 4. Events */}
            <Section title="할인 & 이벤트" icon={Camera} isLast>
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-800 p-4 rounded-xl border border-pink-100 dark:border-neutral-700">
                        <div>
                            <p className="font-bold text-pink-600 dark:text-pink-400 text-sm">📸 인생샷 할인</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">사진 10장 + 영상 1컷 제공 시</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">3,000원 할인</span>
                    </div>
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-800 p-4 rounded-xl border border-blue-100 dark:border-neutral-700">
                        <div>
                            <p className="font-bold text-blue-600 dark:text-blue-400 text-sm">📝 정성 후기 페이백</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">블로그/인스타 리뷰 작성 시</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">2만원 환급</span>
                    </div>
                </div>
            </Section>

            <div className="pt-4 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-600">
                    WAVY 파티는 단순한 자리가 아니라,<br />기억에 남을 설레는 추억이 되길 바라요.
                </p>
            </div>
        </div>
    );
};

export default InviteDetails;

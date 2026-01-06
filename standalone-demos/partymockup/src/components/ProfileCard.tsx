import React, { useState } from 'react';
import { MapPin, Briefcase, Sparkles, Heart, Coffee, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import ImageViewer from './common/ImageViewer';

interface ProfileCardProps {
    user: User;
    themeMode?: 'day' | 'night';
    themeStyle?: 'standard' | 'glass';
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, themeMode = 'day', themeStyle = 'standard' }) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    if (!user) return null;

    const isDark = themeMode === 'night';
    const isGlass = themeStyle === 'glass';

    // Helper: Normalize images to array
    const imageList: string[] = Array.isArray(user.avatar)
        ? user.avatar
        : (user.avatar ? [user.avatar] : []);

    const openImageViewer = () => setIsViewerOpen(true);
    const closeImageViewer = () => setIsViewerOpen(false);

    // Theme Classes
    const cardBgClass = isGlass
        ? isDark
            ? 'bg-slate-900/60 backdrop-blur-xl border border-white/10'
            : 'bg-white/60 backdrop-blur-xl border border-white/40'
        : isDark
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-white border border-gray-100';

    const textMainClass = isDark ? 'text-white' : 'text-gray-800';
    const textSubClass = isDark ? 'text-gray-400' : 'text-gray-500';
    const dividerClass = isDark ? 'border-gray-700' : 'border-gray-100';

    // Badge Logic
    const badges = [
        { label: user.mbti, color: 'bg-indigo-100 text-indigo-700', icon: <UserIcon size={12} className="mr-1" /> },
        { label: user.drinking === '안함' ? '안함' : user.drinking, color: user.drinking === '안함' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700', icon: <span className="mr-1 text-[10px] opacity-70 pt-[1px]">음주</span> },
        { label: user.smoking === '비흡연' ? '안함' : (user.smoking === '흡연' ? '함' : user.smoking), color: user.smoking === '비흡연' ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-600', icon: <span className="mr-1 text-[10px] opacity-70 pt-[1px]">흡연</span> },
        { label: user.religion, color: 'bg-blue-50 text-blue-600', icon: null }
    ].filter(b => b.label && b.label !== '무교');

    return (
        <>
            <div className={`w-full ${cardBgClass} rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative`}>

                {/* 1. Header (Compact Style) */}
                <div className={`px-6 pt-6 pb-4 flex items-center gap-5 border-b sticky top-0 z-10 ${isDark ? 'border-slate-700 bg-slate-800/90' : 'border-gray-100 bg-white/90'} backdrop-blur-sm`}>
                    {/* Avatar (Smaller, Left) */}
                    <div
                        className="relative shrink-0 cursor-pointer group"
                        onClick={openImageViewer}
                    >
                        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-300 to-indigo-300 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-white">
                            {imageList.length > 0 ? (
                                <img
                                    src={imageList[0]}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover bg-white"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                                    <UserIcon size={24} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                        {imageList.length > 1 && (
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white z-20">
                                +{imageList.length - 1}
                            </div>
                        )}
                        {/* Gender Icon */}
                        {imageList.length <= 1 && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-50">
                                {user.gender === 'F'
                                    ? <Heart size={12} className="text-pink-500 fill-pink-500" />
                                    : <Sparkles size={12} className="text-blue-500 fill-blue-500" />
                                }
                            </div>
                        )}
                    </div>

                    {/* Info (Right) */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                            <h2 className={`text-xl font-bold ${textMainClass} truncate pr-2`}>{user.name}</h2>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                                {(() => {
                                    if (user.age) return user.age + '세';
                                    if (user.birthDate && user.birthDate.length === 8) {
                                        const year = parseInt(user.birthDate.substring(0, 4));
                                        return (new Date().getFullYear() - year + 1) + '세';
                                    }
                                    return '??세';
                                })()}
                            </span>
                        </div>
                        <p className={`text-sm ${textSubClass} truncate flex items-center gap-1 mt-0.5`}>
                            <Briefcase size={12} />
                            {user.job || '직업 비공개'}
                        </p>
                        <p className={`text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5`}>
                            <MapPin size={12} />
                            {user.location || '위치 비공개'}
                        </p>
                    </div>
                </div>

                {/* 2. Scrollable Content Contents */}
                <div className={`px-6 py-5 space-y-5 ${isDark ? 'bg-black/20' : 'bg-gray-50/50'}`}>

                    {/* Badges Row (MBTI + LifeStyle) */}
                    <div className="flex flex-wrap gap-2">
                        {badges.map((badge, i) => (
                            <span key={i} className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold border ${isDark ? 'bg-slate-700 text-gray-300 border-slate-600' : 'bg-white text-gray-600 border-gray-200 shadow-sm'}`}>
                                {badge.icon}
                                {badge.label}
                            </span>
                        ))}
                        {badges.length === 0 && <span className="text-xs text-gray-400">등록된 태그가 없습니다.</span>}
                    </div>

                    {/* Introduction */}
                    {user.introduction && (
                        <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} border ${dividerClass} shadow-sm`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">💬</span>
                                <span className={`text-xs font-bold uppercase tracking-wider ${textSubClass}`}>자기소개</span>
                            </div>
                            <p className={`${textMainClass} text-sm leading-relaxed whitespace-pre-wrap text-left`}>
                                {user.introduction}
                            </p>
                        </div>
                    )}

                    {/* Hobbies (Chips) */}
                    {(user.hobbies) && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Coffee size={14} className="text-rose-400" />
                                <span className={`text-xs font-bold uppercase tracking-wider ${textSubClass}`}>Hobbies</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(user.hobbies) ? user.hobbies : (user.hobbies || "").split(',')).map((hobby, i) => {
                                    const tag = typeof hobby === 'string' ? hobby.trim() : hobby;
                                    if (!tag) return null;
                                    return (
                                        <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm ${isDark ? 'bg-slate-700 text-white shadow-none' : 'bg-white text-gray-700 shadow-gray-100'}`}>
                                            # {tag}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Detail Grid: Pros & Ideal Types */}
                    <div className="space-y-3">
                        {user.pros && (
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} border ${dividerClass} shadow-sm`}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Sparkles size={14} className="text-yellow-500" />
                                    <span className={`text-xs font-bold ${textSubClass}`}>나의 매력 포인트</span>
                                </div>
                                <p className={`${textMainClass} text-sm text-left`}>{user.pros}</p>
                            </div>
                        )}

                        {/* Ideal Type Sections */}
                        {(user.idealTypePersonality || user.idealTypeAppearance) && (
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'} border ${dividerClass} shadow-sm`}>
                                <div className="flex items-center gap-2 mb-2.5">
                                    <Heart size={14} className="text-pink-500" />
                                    <span className={`text-xs font-bold ${textSubClass}`}>내가 찾는 사람</span>
                                </div>
                                <div className="space-y-3">
                                    {user.idealTypePersonality && (
                                        <div className="flex gap-3 items-start">
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 ${isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>성격</div>
                                            <p className={`${textMainClass} text-sm text-left`}>{user.idealTypePersonality}</p>
                                        </div>
                                    )}
                                    {user.idealTypeAppearance && (
                                        <div className="flex gap-3 items-start">
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 ${isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>외모</div>
                                            <p className={`${textMainClass} text-sm text-left`}>{user.idealTypeAppearance}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <ImageViewer
                    isOpen={isViewerOpen}
                    onClose={closeImageViewer}
                    images={imageList}
                />
            </div>
        </>
    );
};
export default ProfileCard;


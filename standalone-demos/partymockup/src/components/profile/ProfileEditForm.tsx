import React from 'react';
import { Camera, Sparkles, Loader2 } from 'lucide-react';
import MBTISelector from './MBTISelector';
import HobbySelector from './HobbySelector';
import { FormData } from '../../pages/ProfileEditPage';

import { ProfileTheme } from '../../constants/profileTheme';

interface ProfileEditFormProps {
    formData: FormData;
    handleInputChange: (field: keyof FormData, value: string | number | string[]) => void;
    theme: ProfileTheme;
    handleSubmit: () => void;
    isSaving: boolean;
    isRevealing: boolean;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    formData,
    handleInputChange,
    theme,
    handleSubmit,
    isSaving,
    isRevealing
}) => {
    return (
        <main className="p-5 max-w-lg mx-auto space-y-6">

            {/* Photo Section */}
            <div className="flex flex-col items-center justify-center my-6">
                <div className="relative">
                    <div className={`w-28 h-28 ${theme.cameraBg} rounded-full flex items-center justify-center border-4 border-white shadow-md relative overflow-hidden`}>
                        <Camera className={`w-8 h-8 ${theme.cameraIcon}`} />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full shadow-lg">
                        <Sparkles className="w-4 h-4" />
                    </button>
                </div>
                <p className="mt-3 text-sm text-gray-500 font-medium">매력적인 사진을 올려주세요</p>
            </div>

            {/* Section 1: Basic Info */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className={`text-sm font-bold ${theme.sectionTitle} mb-4 uppercase tracking-wide`}>Essential Info</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            닉네임 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="예: 션"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${theme.inputRing} transition-all font-medium`}
                            value={formData.nickname}
                            onChange={(e) => handleInputChange('nickname', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">직업</label>
                        <input
                            type="text"
                            value={formData.job}
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">* 신청 시 입력한 정보입니다 (수정 불가).</p>
                    </div>
                </div>
            </section>

            {/* Section 2: Details */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className={`text-sm font-bold ${theme.sectionTitle} mb-4 uppercase tracking-wide`}>About Me</h2>

                <div className="space-y-6">
                    {/* MBTI Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">MBTI</label>
                        <MBTISelector
                            value={formData.mbti}
                            onChange={(val) => handleInputChange('mbti', val)}
                            theme={theme}
                        />
                    </div>

                    {/* Drinking */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">음주 스타일</label>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {[
                                { label: '못함', value: 'none' },
                                { label: '가끔', value: 'social' },
                                { label: '주 1-2회', value: 'regular' },
                                { label: '애주가', value: 'heavy' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleInputChange('drinking', opt.value)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm border transition-all ${formData.drinking === opt.value
                                        ? 'bg-gray-800 text-white border-gray-800'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Smoking */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">흡연 여부</label>
                        <div className="flex gap-3">
                            {[
                                { label: '비흡연', value: 'no' },
                                { label: '흡연', value: 'yes' }
                            ].map(opt => (
                                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.smoking === opt.value ? theme.radioBorder : 'border-gray-300'}`}>
                                        {formData.smoking === opt.value && <div className={`w-2.5 h-2.5 rounded-full ${theme.radioDot}`} />}
                                    </div>
                                    <span className="text-sm text-gray-600" onClick={() => handleInputChange('smoking', opt.value)}>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Section 3: Emotional Text */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className={`text-sm font-bold ${theme.sectionTitle} mb-4 uppercase tracking-wide`}>My Story</h2>

                <div className="space-y-4">
                    {/* Hobbies Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">취미 / 관심사</label>
                        <HobbySelector
                            hobbies={formData.hobbies}
                            onChange={(val) => handleInputChange('hobbies', val)}
                            theme={theme}
                        />
                        <p className="text-xs text-gray-400 mt-1.5 pl-1">자신의 취미나 관심사를 태그로 편하게 입력해보세요!</p>
                    </div>

                    {/* Pros */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">나의 매력 포인트</label>
                        <textarea
                            rows={2}
                            placeholder="예: 웃음이 많아요, 경청을 잘해요."
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${theme.inputRing} text-sm resize-none`}
                            value={formData.pros}
                            onChange={(e) => handleInputChange('pros', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Ideal Type */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className={`text-sm font-bold ${theme.sectionTitle} mb-4 uppercase tracking-wide`}>My Ideal Type</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">성격적 이상형</label>
                        <textarea
                            rows={2}
                            placeholder="예: 다정하고 배려심 깊은 사람, 대화 코드가 잘 맞는 사람"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${theme.inputRing} text-sm resize-none`}
                            value={formData.idealTypePersonality || ''}
                            onChange={(e) => handleInputChange('idealTypePersonality', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">외모적 이상형</label>
                        <textarea
                            rows={2}
                            placeholder="예: 웃는 모습이 예쁜 사람, 깔끔한 스타일"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${theme.inputRing} text-sm resize-none`}
                            value={formData.idealTypeAppearance || ''}
                            onChange={(e) => handleInputChange('idealTypeAppearance', e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className={`text-sm font-bold ${theme.sectionTitle} mb-4 uppercase tracking-wide`}>Introduction</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">나는 어떤 사람인가요?</label>
                    <div className="relative">
                        <textarea
                            rows={4}
                            placeholder="상대방에게 나를 자유롭게 표현해주세요. (성격, 가치관 등)"
                            className={`w-full px-4 py-4 rounded-xl ${theme.textAreaBg} border ${theme.textAreaBorder} focus:outline-none focus:ring-2 ${theme.inputRing} text-sm leading-relaxed resize-none`}
                            value={formData.introduction}
                            onChange={(e) => handleInputChange('introduction', e.target.value)}
                        />
                        <Sparkles className={`absolute bottom-3 right-3 w-4 h-4 ${theme.iconColor} opacity-50`} />
                    </div>
                </div>
            </section>

            {/* Submit Button */}
            <button
                className={`w-full ${theme.submitBtn} text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={handleSubmit}
                disabled={isSaving || isRevealing}
            >
                {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        저장 중...
                    </span>
                ) : (
                    "저장하고 상대 프로필 보기"
                )}
            </button>

        </main>
    );
};

export default ProfileEditForm;

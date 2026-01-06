import React from 'react';
import { User } from '../../types';

interface PartnerListItemProps {
    user: User;
    onClick: (user: User) => void;
}

const PartnerListItem: React.FC<PartnerListItemProps> = ({ user, onClick }) => {
    // Check if profile is essentially empty or missing core fields
    const isProfileIncomplete = !user.job && !user.mbti;

    if (isProfileIncomplete) {
        return (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex gap-4 items-center opacity-70 grayscale">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-1">
                    미작성
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-500 text-lg">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-md font-medium">프로필 작성 중...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onClick(user)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
        >
            <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full bg-gray-100 object-cover" />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800 text-lg">{user.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{user.age}세</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{user.job || '직업 비공개'}</p>
                <div className="flex gap-1">
                    <span className="text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md font-medium">{user.mbti}</span>
                </div>
            </div>
        </div>
    );
};

export default PartnerListItem;

import React from 'react';

interface SessionStatusBadgeProps {
    status: string;
    className?: string;
}

export const SessionStatusBadge: React.FC<SessionStatusBadgeProps> = ({ status, className = "" }) => {
    const getStatusStyle = () => {
        switch (status) {
            case 'LIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'BREAK': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'SELECTION': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'WAITING': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200'; // ENDED
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'LIVE': return '진행 중';
            case 'BREAK': return '휴식 시간';
            case 'SELECTION': return '최종 선택';
            case 'WAITING': return '대기 중';
            default: return '종료됨';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusStyle()} ${className}`}>
            {getStatusLabel()}
        </span>
    );
};

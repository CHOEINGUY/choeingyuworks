import React from 'react';
import { User } from '../../../types';

interface SessionMoveModalProps {
    isOpen: boolean;
    user?: User;
    sessions: Record<string, any>;
    currentSessionId?: string;
    onMove: (sessionId: string) => void;
    onClose: () => void;
}

const SessionMoveModal: React.FC<SessionMoveModalProps> = ({ isOpen, user, sessions, currentSessionId, onMove, onClose }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-2">세션 이동</h3>
                <p className="text-gray-600 mb-6">
                    <span className="font-bold text-gray-900">{user.name}</span>님을 어디로 이동시킬까요?
                </p>

                <div className="space-y-2 mb-6 max-h-[60vh] overflow-y-auto">
                    {sessions && Object.entries(sessions).map(([sid, meta]) => {
                        if (sid === currentSessionId) return null; // Skip current
                        return (
                            <button
                                key={sid}
                                onClick={() => onMove(sid)}
                                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all group"
                            >
                                <div className="font-bold text-gray-800 group-hover:text-pink-700">{meta.title}</div>
                                <div className="text-xs text-gray-400 group-hover:text-pink-500">{meta.date}</div>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default SessionMoveModal;

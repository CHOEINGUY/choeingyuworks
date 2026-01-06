import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useSessions } from '../../hooks/useSessions';
import { User } from '../../types';
import { User as UserIcon } from 'lucide-react';

const FIXED_ADMIN_EMAIL = 'admin@rotation.com';

interface ManualEntryAuthProps {
    usersData?: Record<string, User>;
}

const ManualEntryAuth: React.FC<ManualEntryAuthProps> = ({ usersData: initialUsersData }) => {
    const navigate = useNavigate();

    // Local State for Manual Entry Flow
    const [manualEntryStep, setManualEntryStep] = useState<'AUTH' | 'SELECTION'>('AUTH');
    const [adminPassword, setAdminPassword] = useState('');
    // const [email, setEmail] = useState(''); // Removed explicit email state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [manualSessionFilter, setManualSessionFilter] = useState('');
    const [manualGenderFilter, setManualGenderFilter] = useState<'M' | 'F'>('M');
    const [selectedUserForModal, setSelectedUserForModal] = useState<User | null>(null);

    // Local users state for dynamic fetching
    const [localUsers, setLocalUsers] = useState<Record<string, User>>({});

    const { sessions } = useSessions();

    // Set default session filter when sessions are loaded
    useEffect(() => {
        if (sessions && Object.keys(sessions).length > 0 && !manualSessionFilter) {
            setManualSessionFilter(Object.keys(sessions)[0]);
        }
    }, [sessions, manualSessionFilter]);

    // Fetch users dynamically when session filter changes
    useEffect(() => {
        if (!manualSessionFilter) {
            setLocalUsers({});
            return;
        }

        const q = query(
            collection(db, 'users'),
            where('sessionId', '==', manualSessionFilter)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersMap: Record<string, User> = {};
            snapshot.forEach((doc) => {
                usersMap[doc.id] = { ...doc.data(), id: doc.id } as User;
            });
            setLocalUsers(usersMap);
        });

        return () => unsubscribe();
    }, [manualSessionFilter]);

    // -------------------------------------------------------------------------
    // Auto-Redirect Guard (Trampoline)
    // -------------------------------------------------------------------------
    // If a user key is already saved in localStorage, bounce them back to session immediately.
    useEffect(() => {
        const savedKey = localStorage.getItem('session_user_key');
        if (savedKey) {
            // Check if we also have an intent to reset (optional, but good for dev)
            // For now, simple guard pattern as requested.
            // Using replace: true to keep history clean.
            navigate(`/session?key=${savedKey}`, { replace: true });
        }
    }, [navigate]);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use Firebase Auth with FIXED EMAIL
            await signInWithEmailAndPassword(auth, FIXED_ADMIN_EMAIL, adminPassword);
            setManualEntryStep('SELECTION');
        } catch (err) {
            console.error("Login failed:", err);
            setError('비밀번호가 올바르지 않거나 권한이 없습니다.');
            setAdminPassword('');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredUsers = () => {
        // Use localUsers instead of prop usersData
        const sourceData = Object.keys(localUsers).length > 0 ? localUsers : (initialUsersData || {});

        return Object.values(sourceData)
            .filter(user => {
                // If using localUsers, sessionId is already filtered by query.
                // If falling back to initialUsersData, we need to check sessionId.
                const sessionMatch = user.sessionId === manualSessionFilter;
                const genderMatch = user.gender === manualGenderFilter;
                return sessionMatch && genderMatch;
            });
    };

    const handleUserSelect = (userId: string) => {
        // Look up in localUsers first, then fallback
        const user = localUsers[userId] || initialUsersData?.[userId];
        if (user) {
            setSelectedUserForModal({ ...user, id: userId });
        }
    };

    const confirmEntry = () => {
        if (selectedUserForModal) {
            // 1. Save Key for Auto-Redirect Guard
            localStorage.setItem('session_user_key', selectedUserForModal.id);
            // 2. Use 'replace' to overwrite the current history entry
            navigate(`/session?key=${selectedUserForModal.id}`, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">관리자 수동 입장</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        관리자 비밀번호를 입력해주세요.<br />
                        <span className="text-xs text-red-400 font-medium">주의: 입장 후 뒤로가기 시 재인증 필요</span>
                    </p>
                </div>

                {manualEntryStep === 'AUTH' ? (
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-center text-lg tracking-widest font-mono"
                                placeholder=""
                                autoFocus
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs font-medium text-center bg-red-50 py-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200 disabled:opacity-50"
                        >
                            {loading ? '인증 중...' : '인증하기'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                        {/* Session Dropdown */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                Select Session
                            </label>
                            <select
                                value={manualSessionFilter}
                                onChange={(e) => setManualSessionFilter(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-pink-500 outline-none bg-white"
                            >
                                <option value="" disabled>-- 세션 선택 --</option>
                                {Object.values(sessions).map((session: any) => (
                                    <option key={session.id} value={session.id}>
                                        {session.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                            {(['M', 'F'] as const).map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setManualGenderFilter(g)}
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${manualGenderFilter === g
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {g === 'M' ? '남성' : '여성'}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {getFilteredUsers().length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    해당 조건의 참가자가 없습니다.
                                </div>
                            ) : (
                                getFilteredUsers().map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleUserSelect(user.id)}
                                        className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-pink-300 hover:bg-pink-50 transition-all flex items-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 flex items-center gap-2">
                                                {user.name}
                                                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                                                    {user.id}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 truncate mt-0.5">
                                                {user.job} • {user.age}세
                                            </div>
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-pink-500">
                                            →
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => setManualEntryStep('AUTH')}
                            className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ← 뒤로가기 (재인증)
                        </button>
                    </div>
                )}
                {/* CONFIRMATION MODAL */}
                {selectedUserForModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop with blur */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl"></div>

                        {/* Modal Content */}
                        <div className="relative bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-300">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                                    {(selectedUserForModal.avatar || selectedUserForModal.image) ? (
                                        <img
                                            src={selectedUserForModal.avatar || selectedUserForModal.image}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon size={32} className="text-gray-400" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {selectedUserForModal.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {selectedUserForModal.job} • {selectedUserForModal.age}세
                                </p>

                                <div className="bg-gray-50 rounded-xl p-3 mb-6">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                                    <p className="text-lg font-mono font-bold text-gray-800 tracking-wide">
                                        {selectedUserForModal.phoneNumber || "010-0000-0000"}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedUserForModal(null)}
                                        className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={confirmEntry}
                                        className="flex-1 py-3 bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors"
                                    >
                                        입장하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManualEntryAuth;

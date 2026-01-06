import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Shield, User, Loader2 } from 'lucide-react';
import { collection, addDoc, deleteDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { ALLOWED_ADMIN_EMAILS } from '../../../data/adminConfig';

interface AdminManagementModalProps {
    onClose: () => void;
    currentEmail: string;
}

interface AdminUser {
    id: string;
    email: string;
    addedBy?: string;
    createdAt?: any;
}

const AdminManagementModal: React.FC<AdminManagementModalProps> = ({ onClose, currentEmail }) => {
    const [dynamicAdmins, setDynamicAdmins] = useState<AdminUser[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    // Fetch Dynamic Admins from Firestore
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const q = query(collection(db, 'admins'));
            const snapshot = await getDocs(q);
            const admins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
            setDynamicAdmins(admins);
        } catch (err) {
            console.error("Failed to fetch admins:", err);
            setError("관리자 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim()) return;

        // Check if already exists (Static or Dynamic)
        if (ALLOWED_ADMIN_EMAILS.includes(newEmail) || dynamicAdmins.some(a => a.email === newEmail)) {
            setError("이미 등록된 관리자입니다.");
            return;
        }

        setAdding(true);
        setError('');

        try {
            await addDoc(collection(db, 'admins'), {
                email: newEmail,
                addedBy: currentEmail,
                createdAt: new Date()
            });
            setNewEmail('');
            fetchAdmins(); // Refresh
        } catch (err) {
            console.error("Failed to add admin:", err);
            setError("관리자 추가에 실패했습니다.");
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!window.confirm("정말 이 관리자를 삭제하시겠습니까?")) return;
        try {
            await deleteDoc(doc(db, 'admins', id));
            fetchAdmins(); // Refresh
        } catch (err) {
            console.error("Failed to delete admin:", err);
            setError("관리자 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">관리자 권한 설정</h2>
                        <p className="text-sm text-gray-500">관리자 페이지 접속 권한을 관리합니다.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1">
                    {/* Add Form */}
                    <form onSubmit={handleAddAdmin} className="mb-6">
                        <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase">새 관리자 추가</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="이메일 주소 입력"
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={adding || !newEmail}
                                className="bg-slate-900 text-white px-4 rounded-xl font-medium text-sm hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center min-w-[3rem]"
                            >
                                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                            </button>
                        </div>
                        {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
                    </form>

                    {/* List */}
                    <div className="space-y-6">
                        {/* Static Admins (Config Check) */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                슈퍼 관리자 (고정)
                            </h3>
                            <div className="space-y-2">
                                {ALLOWED_ADMIN_EMAILS.map((email: string) => (
                                    <div key={email} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 opacity-75">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{email}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Admins (Firestore) */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                <User className="w-3 h-3" />
                                일반 관리자 (추가됨)
                            </h3>
                            {loading ? (
                                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
                            ) : dynamicAdmins.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    추가된 관리자가 없습니다.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {dynamicAdmins.map((admin) => (
                                        <div key={admin.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{admin.email}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="삭제"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminManagementModal;

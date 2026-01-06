import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../../firebase';

interface AdminLoginFormProps {
    externalError?: string;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ externalError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sync external error (e.g. whitelist rejection) to local state
    React.useEffect(() => {
        if (externalError) {
            setError(externalError);
            setLoading(false); // Stop spinning when error arrives
        }
    }, [externalError]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            console.error(err);
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            console.error("Google Login Error Detailed:", err);
            // Show specific error code to help debugging
            const errorMessage = err.code
                ? `Google 로그인 오류 (${err.code}): ${err.message}`
                : 'Google 로그인 중 오류가 발생했습니다.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 text-slate-900 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-sm bg-white p-8 md:p-10 rounded-none md:rounded-3xl shadow-2xl shadow-gray-200/50"
            >
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Admin Portal</h2>
                    <p className="text-gray-400 text-sm">관리자 계정으로 계속하기</p>
                </div>

                <div className="space-y-6">
                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-slate-700 font-medium py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]"
                    >
                        {/* Google Logo SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google로 계속하기
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-400">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full bg-gray-50 border-none text-slate-900 placeholder-gray-400 text-sm rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="w-full bg-gray-50 border-none text-slate-900 placeholder-gray-400 text-sm rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-rose-500 text-xs font-medium text-center bg-rose-50 py-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>로그인</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginForm;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';


const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleEnter = () => {
        // Navigate to session without key -> Triggers ManualEntryAuth
        navigate(`/session`);
    };

    return (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="z-10 text-center max-w-md w-full">
                <div className="mx-auto bg-white p-4 rounded-full shadow-lg w-20 h-20 flex items-center justify-center mb-6">
                    <Heart className="text-pink-500 fill-pink-500" size={40} />
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Random <span className="text-pink-600">Dating</span>
                </h1>
                <p className="text-gray-600 mb-10 text-lg">
                    7명의 이성을 50분 동안 만나보세요.<br />실시간으로 진행되는 1:1 로테이션 대화.
                </p>

                <button
                    onClick={handleEnter}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl text-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 active:translate-y-0"
                >
                    입장하기
                </button>
            </div>

            <p className="absolute bottom-8 text-gray-400 text-sm">Prototype Build v0.1</p>
        </div>
    );
};
export default Home;

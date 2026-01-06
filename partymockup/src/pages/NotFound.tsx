import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <AlertCircle className="text-pink-500 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
            <p className="text-xl text-gray-600 mb-8">찾으시는 페이지가 존재하지 않거나 이동되었습니다.</p>
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition-all shadow-md active:scale-95"
            >
                <Home size={20} />
                홈으로 돌아가기
            </button>
        </div>
    );
};

export default NotFound;

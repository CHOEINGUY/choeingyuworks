import React from 'react';

const ParallaxBackground: React.FC = () => {
    return (
        <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-screen bg-top bg-no-repeat z-0"
            style={{
                backgroundSize: '120%', // 👈 여기 숫자를 조절하세요 (예: 100%, 150% 등)
                // 👇 그라데이션 조절 (0%~100% 구간별 투명도/색상 설정)
                // 예: rgba(0,0,0,0) 50% -> 위에서 50%까지는 투명
                // 예: rgba(0,0,0,1) 95% -> 95% 지점부터는 완전 검정
                // 👇 그라데이션 '위치' 조절하는 법 (linear-gradient 사용)
                // 180deg: 위에서 아래로 내려옴
                // rgba(0,0,0,0) 50%: 화면 맨 위(0%)부터 중간(50%)까지는 투명함 (이미지 보임)
                // rgba(0,0,0,1) 100%: 맨 아래(100%)는 완전 검정색으로 끝남
                // "검정 영역을 더 위로 올리려면" -> 50%를 30%로 줄이거나, 100% 대신 80%를 사용하세요.
                backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 25%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,1) 55%), url('/logo/wavy_background.webp'), linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            }}
            aria-hidden="true"
        />
    );
};

export default ParallaxBackground;

import React from 'react';

interface TypewriterProps {
    text: string;
    delay: number;
    loop?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, delay, loop = true }) => {
    const [displayText, setDisplayText] = React.useState('');
    
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    if (loop) {
                        // Reset for loop
                        setTimeout(() => {
                            setDisplayText('');
                            currentIndex = 0;
                        }, 5000);
                    }
                }
            }, 100); // Typing speed
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [text, delay, loop]);

    return <span>{displayText}</span>;
};

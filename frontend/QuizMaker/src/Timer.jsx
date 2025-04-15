// Timer.jsx
import { useEffect, useState } from 'react';

export default function Timer({ durationInSeconds, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeout) onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed top-4 left-4 bg-yellow-500 text-black px-4 py-2 rounded-lg text-lg shadow-md z-50">
    <span className="text-lg">🕒</span>
    <span className="text-lg font-bold">{formatTime(timeLeft)}</span>    </div>
  );
}

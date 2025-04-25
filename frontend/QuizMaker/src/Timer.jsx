import { useEffect, useState, useRef } from 'react';

export default function Timer({ durationInSeconds, onTimeout, startTime }) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const called = useRef(false);

  useEffect(() => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(durationInSeconds - elapsed, 0);
      setTimeLeft(remaining);
    }
    called.current = false; // ✅ ضروري تعيد تهيئة دا مع تغيير startTime
  }, [startTime, durationInSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!called.current && onTimeout) {
            called.current = true;
            onTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed block top-2 left-4 bg-yellow-500 text-black px-4 py-2 rounded-lg text-lg shadow-md z-50">
      <span className="text-lg">🕒</span>
      <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
    </div>
  );
}

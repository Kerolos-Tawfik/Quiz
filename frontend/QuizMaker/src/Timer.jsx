import { useEffect, useState, useRef } from 'react';

export default function Timer({ durationInSeconds, onTimeout, startTime }) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const called = useRef(false);

  useEffect(() => {
    if (startTime) {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(durationInSeconds - elapsed, 0);
      setTimeLeft(remaining);
    }
    called.current = false; // عشان مع كل قسم جديد أو إعادة يبدأ نظيف
  }, [startTime, durationInSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!startTime) return;

      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(durationInSeconds - elapsed, 0);

      setTimeLeft(remaining);

      if (remaining <= 0 && !called.current) {
        clearInterval(timer);
        called.current = true;
        if (onTimeout) onTimeout();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout, startTime, durationInSeconds]);

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

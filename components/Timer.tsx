import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  stepTitle: string;
  onComplete?: () => void;
}

export function Timer({ duration, stepTitle, onComplete }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset when duration changes (new step)
    setTimeRemaining(duration);
    setIsRunning(false);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [duration]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            if (onComplete) {
              onComplete();
            }
            // Play notification sound (browser beep)
            if ('vibrate' in navigator) {
              navigator.vibrate(200);
            }
            // Show notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Timer Complete!', {
                body: `${stepTitle} is done!`,
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, stepTitle, onComplete]);

  const handlePlayPause = () => {
    if (timeRemaining === 0) {
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeRemaining(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeRemaining) / duration) * 100;

  return (
    <div className={`border-2 rounded-xl p-6 transition-all ${
      isCompleted
        ? 'border-green-500 bg-green-50'
        : isRunning
        ? 'border-orange-500 bg-orange-50'
        : 'border-gray-300 bg-gray-50'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-orange-600'}`} />
        <span className={`${isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
          {isCompleted ? 'Timer Complete!' : 'Timer'}
        </span>
      </div>

      {/* Time Display */}
      <div className="text-center mb-4">
        <div className={`text-5xl tracking-wider mb-2 ${
          isCompleted ? 'text-green-600' : isRunning ? 'text-orange-600' : 'text-gray-700'
        }`}>
          {formatTime(timeRemaining)}
        </div>
        <div className="text-gray-500">
          {duration >= 60
            ? `${Math.floor(duration / 60)} minute${Math.floor(duration / 60) !== 1 ? 's' : ''}`
            : `${duration} seconds`}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className={`h-2 rounded-full transition-all ${
            isCompleted ? 'bg-green-500' : 'bg-orange-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handlePlayPause}
          disabled={timeRemaining === 0}
          className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all ${
            timeRemaining === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isRunning
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="py-3 px-6 rounded-lg flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {isCompleted && (
        <div className="mt-4 text-center text-green-700 animate-pulse">
          Time&apos;s up! Move on when ready.
        </div>
      )}
    </div>
  );
}

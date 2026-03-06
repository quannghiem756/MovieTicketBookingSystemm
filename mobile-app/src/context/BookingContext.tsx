import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface BookingContextType {
  timeLeft: number;
  isTimerActive: boolean;
  heldSeats: string[];
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setHeldSeats: (seats: string[]) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [heldSeats, setHeldSeats] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerActive(true);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    setTimeLeft(0);
    setIsTimerActive(false);
    setHeldSeats([]);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsTimerActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);

  return (
    <BookingContext.Provider
      value={{
        timeLeft,
        isTimerActive,
        heldSeats,
        startTimer,
        stopTimer,
        resetTimer,
        setHeldSeats,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

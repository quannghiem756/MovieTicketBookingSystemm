import { renderHook, act } from '@testing-library/react-native';
import { BookingProvider, useBooking } from './BookingContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BookingProvider>{children}</BookingProvider>
);

describe('BookingContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    
    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isTimerActive).toBe(false);
    expect(result.current.heldSeats).toEqual([]);
  });

  it('starts the timer correctly', () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.startTimer(600);
    });

    expect(result.current.timeLeft).toBe(600);
    expect(result.current.isTimerActive).toBe(true);
  });

  it('decrements the timer over time', () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.startTimer(600);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(599);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(594);
  });

  it('stops the timer when it reaches zero', () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.startTimer(2);
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isTimerActive).toBe(false);
  });

  it('stops the timer manually', () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.startTimer(600);
    });

    expect(result.current.isTimerActive).toBe(true);

    act(() => {
      result.current.stopTimer();
    });

    expect(result.current.isTimerActive).toBe(false);
    
    act(() => {
        jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeLeft).toBe(600); // Should not have decremented
  });

  it('resets the timer and seats', () => {
    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.startTimer(600);
      result.current.setHeldSeats(['A1', 'A2']);
    });

    expect(result.current.heldSeats).toEqual(['A1', 'A2']);

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isTimerActive).toBe(false);
    expect(result.current.heldSeats).toEqual([]);
  });
});

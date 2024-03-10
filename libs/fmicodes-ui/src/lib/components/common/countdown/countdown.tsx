'use client';

import { useEffect, useState } from 'react';

function useCountdown(targetDate) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date(targetDate);
    if (target < new Date()) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(Math.max(d, 0));

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      setHours(Math.max(h, 0));

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutes(Math.max(m, 0));

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSeconds(Math.max(s, 0));
    }, 1000);

    // #TODO: resolve this linting error
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [targetDate]);

  return [days, hours, minutes, seconds];
}

export interface CountdownProps {
  targetDate: string;
}

export function Countdown({ targetDate }: CountdownProps) {
  const timeValues = useCountdown(targetDate);

  return (
    <div className="flex flex-row justify-center items-center ">
      {timeValues.map((value) => (
        <p
          key={Math.random()}
          className="acrylic text-xl sm:text-2xl text-center font-black capitalize p-1 m-1 border border-yellow-300 rounded"
        >
          {value.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
        </p>
      ))}
    </div>
  );
}

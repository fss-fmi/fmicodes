'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './blobcho.module.scss';

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<{
    x: number | null;
    y: number | null;
  }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    function updateMousePosition(ev) {
      let x: number;
      let y: number;

      if (ev.clientX !== undefined) {
        x = ev.clientX;
      } else if (ev.targetTouches?.length > 0) {
        x = ev.targetTouches[0].pageX;
      }

      if (ev.clientY !== undefined) {
        y = ev.clientY;
      } else if (ev.targetTouches?.length > 0) {
        y = ev.targetTouches[0].pageY;
      }

      setMousePosition({ x, y });
    }
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('touchmove', updateMousePosition);
    window.addEventListener('touchstart', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('touchmove', updateMousePosition);
      window.removeEventListener('touchstart', updateMousePosition);
    };
  }, []);
  return mousePosition;
}

export function Blobcho() {
  const mousePosition = useMousePosition();
  const blobRef = useRef<HTMLDivElement>(null);

  const blob = blobRef.current;
  if (blob) {
    blob.animate(
      {
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
      },
      { duration: 1000, fill: 'forwards' },
    );
  }

  return (
    <div
      id="blobcho"
      className={styles.container}
      style={{
        opacity: mousePosition.x ? 100 : 0,
        transitionDuration: '2s',
      }}
    >
      <div ref={blobRef} className={styles.blob} />
    </div>
  );
}

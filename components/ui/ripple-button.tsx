'use client';

import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RippleButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export function RippleButton({ children, className, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <Button
      {...props}
      className={`relative overflow-hidden ${className}`}
      onClick={(e) => {
        handleClick(e);
        if (props.onClick) {
          props.onClick(e);
        }
      }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      {children}
    </Button>
  );
}

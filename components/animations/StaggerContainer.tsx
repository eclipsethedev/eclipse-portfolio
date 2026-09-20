'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerContainer, staggerFastContainer, staggerSlowContainer } from '@/lib/animations';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  speed?: 'fast' | 'normal' | 'slow';
}

export default function StaggerContainer({
  children,
  className = '',
  speed = 'normal',
}: StaggerContainerProps) {
  const variants = {
    fast: staggerFastContainer,
    normal: staggerContainer,
    slow: staggerSlowContainer,
  }[speed];

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { scrollReveal, viewportConfig } from '@/lib/animations';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      variants={scrollReveal}
      initial="initial"
      whileInView="whileInView"
      viewport={viewportConfig}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

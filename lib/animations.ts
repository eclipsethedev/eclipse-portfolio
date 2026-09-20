/**
 * Animation System
 * Centralized animation configuration for consistent motion language
 */

import { Variants } from 'framer-motion';

// ============================================
// TIMING & EASING
// ============================================

export const easings = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  smoothOut: [0.16, 1, 0.3, 1],
  spring: { type: 'spring', stiffness: 100, damping: 15 },
  bounce: { type: 'spring', stiffness: 400, damping: 17 },
} as const;

export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
  slower: 0.6,
} as const;

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smoothOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
};

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easings.smoothOut,
    },
  },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

// ============================================
// STAGGER CONTAINERS
// ============================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerFastContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const staggerSlowContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ============================================
// STAGGER CHILDREN
// ============================================

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

// ============================================
// SCROLL REVEAL
// ============================================

export const scrollReveal: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

export const scrollRevealScale: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  whileInView: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.smoothOut,
    },
  },
};

// ============================================
// HOVER INTERACTIONS
// ============================================

export const hoverLift = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
};

export const hoverGlow = {
  rest: { filter: 'brightness(1)' },
  hover: {
    filter: 'brightness(1.1)',
    transition: {
      duration: durations.fast,
    },
  },
};

// ============================================
// BUTTON INTERACTIONS
// ============================================

export const buttonHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: easings.smooth,
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
  },
};

// ============================================
// CARD INTERACTIONS
// ============================================

export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)',
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.3)',
    transition: {
      duration: 0.3,
      ease: easings.smoothOut,
    },
  },
};

// ============================================
// IMAGE ANIMATIONS
// ============================================

export const imageReveal: Variants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slower,
      ease: easings.smoothOut,
    },
  },
};

export const imageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: {
      duration: 0.5,
      ease: easings.smoothOut,
    },
  },
};

// ============================================
// VIEWPORT CONFIG
// ============================================

export const viewportConfig = {
  once: true,
  margin: '-50px',
  amount: 0.2,
};

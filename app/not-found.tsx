'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 404 */}
        <motion.div
          className="text-[120px] md:text-[180px] font-bold text-neutral-900 leading-none select-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          404
        </motion.div>

        {/* Message */}
        <motion.div
          className="space-y-3 -mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-white text-xl font-medium">Page not found</p>
          <p className="text-neutral-500 text-sm max-w-xs mx-auto">
            This page doesn&apos;t exist. You might have the wrong link.
          </p>
        </motion.div>

        {/* Back home */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors duration-300"
            >
              Back to home
            </Link>
          </motion.div>
        </motion.div>

        {/* Subtle divider */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="h-px w-12 bg-neutral-900" />
          <span className="text-neutral-700 text-xs">eclipsethedev.store</span>
          <div className="h-px w-12 bg-neutral-900" />
        </motion.div>
      </motion.div>
    </div>
  );
}

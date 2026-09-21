'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EclipseWordmark from '@/components/EclipseWordmark';
import StaggerContainer from '@/components/animations/StaggerContainer';
import { staggerItem, fadeInUp, imageReveal, imageHover } from '@/lib/animations';

function ProfileImage() {
  const [imageError, setImageError] = useState(false);
  return (
    <motion.div className="relative w-full h-full" variants={imageReveal} initial="initial" animate="animate">
      {!imageError ? (
        <Image src="/profile.jpg" alt="Eclipse" fill className="object-cover" onError={() => setImageError(true)} priority />
      ) : (
        <div className="w-full h-full bg-neutral-900" />
      )}
    </motion.div>
  );
}

export default function Home() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then(setContent);
  }, []);

  if (!content) return null;

  const h = content.hero;

  return (
    <div className="min-h-screen page-transition texture-overlay">
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <StaggerContainer className="lg:col-span-6 space-y-8" speed="slow">
              <motion.div variants={staggerItem} className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-wider">
                <motion.div
                  className="w-1 h-1 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {h.status}
              </motion.div>

              <motion.div variants={staggerItem} className="space-y-4">
                <div className="relative">
                  <EclipseWordmark />
                </div>
                <motion.div variants={fadeInUp} className="text-xl md:text-2xl text-neutral-400 font-light">
                  {h.subtitle}
                </motion.div>
              </motion.div>

              <motion.p variants={staggerItem} className="text-lg text-neutral-400 max-w-lg leading-relaxed">
                {h.description}
              </motion.p>

              <motion.div variants={staggerItem} className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/projects" className="block px-6 py-3 bg-white text-black font-medium hover:bg-neutral-200 transition-colors duration-300">
                      View Projects
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/contact" className="block px-6 py-3 border border-neutral-800 text-white hover:border-neutral-600 hover:bg-neutral-900/50 transition-all duration-300">
                      Contact Me
                    </Link>
                  </motion.div>
                </div>
                <motion.div
                  className="text-sm text-neutral-500"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Explore my work ↓
                </motion.div>
              </motion.div>
            </StaggerContainer>

            {/* Right */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div className="relative aspect-[3/4] max-w-md lg:max-w-none mx-auto" variants={imageHover} initial="rest" whileHover="hover">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                <div className="relative h-full overflow-hidden">
                  <ProfileImage />
                </div>
                <motion.div
                  className="absolute -bottom-4 -right-4 w-32 h-32 bg-violet-600/10 blur-3xl pointer-events-none"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom */}
          <motion.div
            className="mt-32 pt-12 border-t border-neutral-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              {[
                { label: 'Focus', value: h.focus },
                { label: 'Building', value: h.specialty },
                { label: 'Also Work With', value: h.also },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="group cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="text-neutral-500 mb-2 group-hover:text-neutral-400 transition-colors duration-300">{item.label}</div>
                  <div className="text-white">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

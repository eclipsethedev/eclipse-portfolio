'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeInUp, scrollReveal, staggerItem, viewportConfig } from '@/lib/animations';

export default function ExperiencePage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then(setContent);
  }, []);

  if (!content) return null;

  return (
    <div className="min-h-screen page-transition texture-overlay">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <motion.div className="mb-20" variants={fadeInUp} initial="initial" animate="animate">
          <h1 className="mb-6">Experience</h1>
          <motion.div className="h-px bg-white" initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
        </motion.div>

        <div className="space-y-20">
          {content.experience.map((exp: any, index: number) => (
            <AnimatedSection key={exp.id}>
              <motion.div
                className={index > 0 ? 'border-t border-neutral-900 pt-20' : ''}
                variants={scrollReveal}
                initial="initial"
                whileInView="whileInView"
                viewport={viewportConfig}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewportConfig} transition={{ duration: 0.5 }}>
                    <h2 className="text-2xl font-semibold mb-2">{exp.title}</h2>
                    <div className="text-neutral-400">{exp.role}</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportConfig} transition={{ duration: 0.4, delay: 0.1 }}>
                    {exp.status === 'Ongoing' ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 text-sm border border-green-500/20 self-start">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-green-500"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        {exp.status}
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-500 self-start">{exp.status}</div>
                    )}
                  </motion.div>
                </div>

                <motion.p className="text-neutral-400 leading-relaxed mb-8" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportConfig} transition={{ duration: 0.5, delay: 0.1 }}>
                  {exp.description}
                </motion.p>

                <div>
                  <motion.div className="text-sm text-neutral-500 uppercase tracking-wider mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportConfig} transition={{ duration: 0.4, delay: 0.2 }}>
                    Responsibilities
                  </motion.div>
                  <motion.ul className="space-y-3 text-neutral-400" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" whileInView="visible" viewport={viewportConfig}>
                    {exp.responsibilities.map((item: string) => (
                      <motion.li key={item} className="flex items-start gap-3 group" variants={{ hidden: { opacity: 0, x: -15 }, visible: { opacity: 1, x: 0 } }}>
                        <span className="text-neutral-600 mt-1 group-hover:text-blue-500 transition-colors duration-300">—</span>
                        <span className="group-hover:text-neutral-300 transition-colors duration-300">{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}

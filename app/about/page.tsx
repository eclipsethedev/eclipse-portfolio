'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeInUp, scrollReveal, staggerItem, viewportConfig } from '@/lib/animations';

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then(setContent);
  }, []);

  if (!content) return null;

  const a = content.about;

  return (
    <div className="min-h-screen page-transition texture-overlay">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <motion.div className="mb-20" variants={fadeInUp} initial="initial" animate="animate">
          <h1 className="mb-6">About</h1>
          <motion.div className="h-px bg-white" initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
        </motion.div>

        {/* Intro */}
        <AnimatedSection className="mb-32 max-w-3xl">
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }} initial="hidden" whileInView="visible" viewport={viewportConfig}>
            <motion.p className="text-xl md:text-2xl text-neutral-300 leading-relaxed mb-6" variants={staggerItem}>{a.intro1}</motion.p>
            <motion.p className="text-lg text-neutral-400 leading-relaxed mb-6" variants={staggerItem}>{a.intro2}</motion.p>
            <motion.p className="text-lg text-neutral-400 leading-relaxed" variants={staggerItem}>{a.intro3}</motion.p>
          </motion.div>
        </AnimatedSection>

        {/* What I Do */}
        <AnimatedSection className="mb-32">
          <motion.h2 className="text-2xl font-semibold mb-12" variants={scrollReveal} initial="initial" whileInView="whileInView" viewport={viewportConfig}>
            What I Do
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={viewportConfig}>
            {[
              { title: 'Web Development', description: 'Building web applications with HTML, CSS, and JavaScript. Learning Python to expand my technical capabilities.' },
              { title: 'Discord Infrastructure', description: 'Creating and managing Discord bots, automation systems, and community infrastructure for gaming and online communities.' },
              { title: 'Technical Projects', description: 'Working on various technical systems, from web platforms to automation tools, with a focus on practical solutions.' },
              { title: 'Community Operations', description: 'Managing community operations, moderation systems, and staff coordination for online communities.' },
            ].map((item) => (
              <motion.div key={item.title} variants={staggerItem} whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Skills */}
        <AnimatedSection>
          <motion.h2 className="text-2xl font-semibold mb-12" variants={scrollReveal} initial="initial" whileInView="whileInView" viewport={viewportConfig}>
            Skills
          </motion.h2>
          <div className="space-y-12">
            {[
              { category: 'Development', items: a.skills.development },
              { category: 'Community & Operations', items: a.skills.community },
            ].map((skillSet, setIndex) => (
              <motion.div key={skillSet.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportConfig} transition={{ duration: 0.5, delay: setIndex * 0.1 }}>
                <div className="text-sm text-neutral-500 mb-4 uppercase tracking-wider">{skillSet.category}</div>
                <motion.div className="flex flex-wrap gap-3" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" whileInView="visible" viewport={viewportConfig}>
                  {skillSet.items.map((skill: string) => (
                    <motion.span
                      key={skill}
                      className="px-4 py-2 bg-neutral-900 text-neutral-300 text-sm border border-neutral-800 transition-all duration-300"
                      variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                      whileHover={{ scale: 1.05, borderColor: '#525252', backgroundColor: '#171717', y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

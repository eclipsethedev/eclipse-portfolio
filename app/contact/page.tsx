'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerItem, scrollReveal, viewportConfig } from '@/lib/animations';

export default function ContactPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then(setContent);
  }, []);

  if (!content) return null;

  const c = content.contact;

  const contacts = [
    { label: 'Email', value: c.email, href: `mailto:${c.email}`, external: false },
    { label: 'Discord', value: c.discord, href: null, external: false },
    { label: 'GitHub', value: c.github, href: `https://github.com/${c.github}`, external: true },
    { label: 'X', value: `@${c.twitter}`, href: `https://x.com/${c.twitter}`, external: true },
  ];

  return (
    <div className="min-h-screen page-transition texture-overlay">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <motion.div className="mb-20" variants={fadeInUp} initial="initial" animate="animate">
          <h1 className="mb-8">Let&apos;s work together</h1>
          <motion.p className="text-xl text-neutral-400 max-w-2xl" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            Open to development work, community opportunities, and collaborations. Reach out through any of these channels.
          </motion.p>
        </motion.div>

        <motion.div className="space-y-12" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }} initial="hidden" animate="visible">
          {contacts.map((contact) => (
            <motion.div key={contact.label} className="border-b border-neutral-900 pb-8" variants={staggerItem}>
              <div className="text-sm text-neutral-500 uppercase tracking-wider mb-3">{contact.label}</div>
              {contact.href ? (
                <motion.a href={contact.href} target={contact.external ? '_blank' : undefined} rel={contact.external ? 'noopener noreferrer' : undefined} className="group inline-block" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <motion.div className="text-2xl text-white transition-colors duration-300 relative" whileHover={{ color: '#a3a3a3' }}>
                    {contact.value}
                    <motion.div className="absolute bottom-0 left-0 h-px bg-white" initial={{ width: 0 }} whileHover={{ width: '100%' }} transition={{ duration: 0.3 }} />
                  </motion.div>
                </motion.a>
              ) : (
                <div className="text-2xl text-white">{contact.value}</div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-20" variants={scrollReveal} initial="initial" whileInView="whileInView" viewport={viewportConfig}>
          <p className="text-sm text-neutral-500">Typically respond within 24-48 hours</p>
        </motion.div>
      </div>
    </div>
  );
}

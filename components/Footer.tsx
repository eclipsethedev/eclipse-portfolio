'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Email', href: 'mailto:eclipsethedeveloper@gmail.com', external: false },
    { name: 'GitHub', href: 'https://github.com/eclipsethedev', external: true },
    { name: 'X', href: 'https://x.com/Eclipsefv1', external: true },
  ];

  return (
    <footer className="relative border-t border-neutral-900 bg-black mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-semibold text-white mb-1">Eclipse</div>
            <div className="text-sm text-neutral-500">Developer</div>
          </motion.div>

          {/* Links */}
          <motion.div 
            className="flex flex-wrap gap-6 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-neutral-400 transition-colors duration-300"
                whileHover={{ color: '#ffffff', y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
              >
                {link.name}
              </motion.a>
            ))}
            <span className="text-neutral-600">
              Discord: Eclipsefv1x
            </span>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="mt-8 pt-8 border-t border-neutral-900 text-center md:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm text-neutral-600">
            © {currentYear} Eclipse
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { fadeInUp, scrollReveal, viewportConfig } from '@/lib/animations';

export default function ProjectsPage() {
  const [content, setContent] = useState<any>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then(setContent);
  }, []);

  if (!content) return null;

  const featured = content.projects.find((p: any) => p.featured);
  const mini = content.projects.filter((p: any) => !p.featured);

  return (
    <div className="min-h-screen page-transition texture-overlay">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        {/* Header */}
        <motion.div className="mb-20" variants={fadeInUp} initial="initial" animate="animate">
          <h1 className="mb-6">Projects</h1>
          <motion.div className="h-px bg-white" initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
        </motion.div>

        {/* Featured project */}
        {featured && (
          <AnimatedSection className="mb-32">
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start" variants={scrollReveal} initial="initial" whileInView="whileInView" viewport={viewportConfig}>
              {/* Image */}
              <motion.div className="order-2 lg:order-1" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
                <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                  {!imageError ? (
                    <motion.div className="relative w-full h-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}>
                      <Image src="/projects/strive-scrims.png" alt={featured.title} fill className="object-cover" onError={() => setImageError(true)} />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-neutral-700 text-sm">Project visual</div>
                    </div>
                  )}
                  <motion.div className="absolute inset-0 bg-blue-500/10 pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.4 }} />
                </div>
              </motion.div>

              {/* Content */}
              <div className="order-1 lg:order-2 space-y-6">
                <div>
                  {featured.status === 'active' && (
                    <motion.div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 text-xs uppercase tracking-wider mb-4 border border-green-500/20" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      Active
                    </motion.div>
                  )}
                  <h2 className="text-3xl md:text-4xl font-semibold mb-4">{featured.title}</h2>
                </div>
                <p className="text-lg text-neutral-400 leading-relaxed">{featured.description}</p>

                <div className="space-y-4 pt-4">
                  {featured.areas.length > 0 && (
                    <div>
                      <div className="text-sm text-neutral-500 uppercase tracking-wider mb-3">Key Areas</div>
                      <ul className="space-y-2 text-neutral-400">
                        {featured.areas.map((area: string, i: number) => (
                          <motion.li key={area} className="flex items-start gap-2" initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewportConfig} transition={{ duration: 0.4, delay: i * 0.08 }}>
                            <span className="text-neutral-600 mt-1">—</span>
                            <span>{area}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {featured.technologies.length > 0 && (
                    <div>
                      <div className="text-sm text-neutral-500 uppercase tracking-wider mb-3">Technologies</div>
                      <div className="flex flex-wrap gap-2">
                        {featured.technologies.map((tech: string, i: number) => (
                          <motion.span
                            key={tech}
                            className="px-3 py-1.5 bg-neutral-900 text-neutral-300 text-sm border border-neutral-800"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, borderColor: '#525252', backgroundColor: '#171717' }}
                            viewport={viewportConfig}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        )}

        {/* Mini projects */}
        {mini.length > 0 && (
          <AnimatedSection>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportConfig} transition={{ duration: 0.5 }} className="mb-12">
              <h2 className="text-2xl font-semibold mb-2">Other Projects</h2>
              <p className="text-neutral-400">Staff positions and community involvement</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mini.map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  className="group bg-neutral-900/50 border border-neutral-800 p-6 hover:border-neutral-700 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportConfig}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -4, borderColor: '#525252' }}
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">{project.role || 'Staff'}</div>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{project.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}

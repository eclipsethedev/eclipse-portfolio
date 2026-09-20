'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'hero' | 'projects' | 'experience' | 'about' | 'contact';

const TABS: { id: Tab; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('hero');
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => {
        if (r.status === 401) { router.push('/admin'); return null; }
        return r.json();
      })
      .then((d) => { if (d) { setData(d); setLoading(false); } });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin');
  };

  const update = (path: string[], value: any) => {
    setData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="border-b border-neutral-900 bg-black sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Content Manager</span>
            <span className="text-neutral-700 text-xs">/ Eclipse Portfolio</span>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <motion.span
                  className="text-green-400 text-xs"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ✓ Saved
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              onClick={save}
              disabled={saving}
              className="px-4 py-1.5 bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
            <button
              onClick={logout}
              className="text-neutral-500 hover:text-white text-xs transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar tabs */}
        <div className="w-40 shrink-0">
          <nav className="space-y-1 sticky top-20">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  tab === t.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
            <div className="pt-4 border-t border-neutral-900 mt-4">
              <a
                href="/"
                target="_blank"
                className="w-full text-left px-3 py-2 text-sm text-neutral-600 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>View Site</span>
                <span className="text-xs">↗</span>
              </a>
            </div>
          </nav>
        </div>

        {/* Main panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'hero' && <HeroTab data={data} update={update} />}
              {tab === 'projects' && <ProjectsTab data={data} setData={setData} />}
              {tab === 'experience' && <ExperienceTab data={data} setData={setData} />}
              {tab === 'about' && <AboutTab data={data} update={update} setData={setData} />}
              {tab === 'contact' && <ContactTab data={data} update={update} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared UI
// ─────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-neutral-900 border border-neutral-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-600 transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-600 transition-colors"
        />
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold mb-6 pb-3 border-b border-neutral-900">{children}</h2>;
}

// ─────────────────────────────────────────────
// Hero Tab
// ─────────────────────────────────────────────

function HeroTab({ data, update }: any) {
  const h = data.hero;
  return (
    <div className="space-y-5">
      <SectionTitle>Hero Section</SectionTitle>
      <Field label="Name" value={h.name} onChange={(v) => update(['hero', 'name'], v)} />
      <Field label="Subtitle" value={h.subtitle} onChange={(v) => update(['hero', 'subtitle'], v)} />
      <Field label="Description" value={h.description} onChange={(v) => update(['hero', 'description'], v)} multiline />
      <Field label="Status Badge" value={h.status} onChange={(v) => update(['hero', 'status'], v)} />
      <div className="grid grid-cols-3 gap-4">
        <Field label="Focus" value={h.focus} onChange={(v) => update(['hero', 'focus'], v)} />
        <Field label="Specialty" value={h.specialty} onChange={(v) => update(['hero', 'specialty'], v)} />
        <Field label="Based" value={h.based} onChange={(v) => update(['hero', 'based'], v)} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Projects Tab
// ─────────────────────────────────────────────

function ProjectsTab({ data, setData }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateProject = (id: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      projects: prev.projects.map((p: any) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addProject = () => {
    const id = `project-${Date.now()}`;
    setData((prev: any) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id, title: 'New Project', description: '', status: 'past', featured: false, role: 'Staff', areas: [], technologies: [] },
      ],
    }));
    setExpanded(id);
  };

  const removeProject = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      projects: prev.projects.filter((p: any) => p.id !== id),
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-900">
        <h2 className="text-base font-semibold">Projects</h2>
        <button
          onClick={addProject}
          className="text-xs px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
        >
          + Add Project
        </button>
      </div>

      <div className="space-y-2">
        {data.projects.map((project: any) => (
          <div key={project.id} className="border border-neutral-900 bg-neutral-950">
            <button
              onClick={() => setExpanded(expanded === project.id ? null : project.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{project.title || 'Untitled'}</span>
                {project.featured && (
                  <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Featured
                  </span>
                )}
                {project.status === 'active' && (
                  <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20">
                    Active
                  </span>
                )}
              </div>
              <span className="text-neutral-600 text-sm">{expanded === project.id ? '↑' : '↓'}</span>
            </button>

            <AnimatePresence>
              {expanded === project.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4 border-t border-neutral-900 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Title"
                        value={project.title}
                        onChange={(v) => updateProject(project.id, 'title', v)}
                      />
                      <div>
                        <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-1.5">
                          Status
                        </label>
                        <select
                          value={project.status}
                          onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 text-white px-3 py-2.5 text-sm focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="past">Past</option>
                        </select>
                      </div>
                    </div>

                    <Field
                      label="Description"
                      value={project.description}
                      onChange={(v) => updateProject(project.id, 'description', v)}
                      multiline
                    />

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={project.featured}
                          onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                          className="accent-white"
                        />
                        <span className="text-sm text-neutral-400">Featured project (shown large)</span>
                      </label>
                    </div>

                    {!project.featured && (
                      <Field
                        label="Role"
                        value={project.role || ''}
                        onChange={(v) => updateProject(project.id, 'role', v)}
                      />
                    )}

                    <ArrayField
                      label="Key Areas"
                      items={project.areas || []}
                      onChange={(v) => updateProject(project.id, 'areas', v)}
                    />

                    <ArrayField
                      label="Technologies"
                      items={project.technologies || []}
                      onChange={(v) => updateProject(project.id, 'technologies', v)}
                    />

                    <div className="pt-2 border-t border-neutral-900">
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors"
                      >
                        Delete project
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Experience Tab
// ─────────────────────────────────────────────

function ExperienceTab({ data, setData }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateExp = (id: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      experience: prev.experience.map((e: any) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  };

  const addExp = () => {
    const id = `exp-${Date.now()}`;
    setData((prev: any) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id, title: 'New Role', role: '', status: 'Ongoing', description: '', responsibilities: [] },
      ],
    }));
    setExpanded(id);
  };

  const removeExp = (id: string) => {
    setData((prev: any) => ({
      ...prev,
      experience: prev.experience.filter((e: any) => e.id !== id),
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-900">
        <h2 className="text-base font-semibold">Experience</h2>
        <button
          onClick={addExp}
          className="text-xs px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
        >
          + Add Entry
        </button>
      </div>

      <div className="space-y-2">
        {data.experience.map((exp: any) => (
          <div key={exp.id} className="border border-neutral-900 bg-neutral-950">
            <button
              onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{exp.title || 'Untitled'}</span>
                <span className="text-xs text-neutral-600">{exp.status}</span>
              </div>
              <span className="text-neutral-600 text-sm">{expanded === exp.id ? '↑' : '↓'}</span>
            </button>

            <AnimatePresence>
              {expanded === exp.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4 border-t border-neutral-900 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Title" value={exp.title} onChange={(v) => updateExp(exp.id, 'title', v)} />
                      <Field label="Role / Subtitle" value={exp.role} onChange={(v) => updateExp(exp.id, 'role', v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Status" value={exp.status} onChange={(v) => updateExp(exp.id, 'status', v)} />
                    </div>
                    <Field label="Description" value={exp.description} onChange={(v) => updateExp(exp.id, 'description', v)} multiline />
                    <ArrayField
                      label="Responsibilities"
                      items={exp.responsibilities || []}
                      onChange={(v) => updateExp(exp.id, 'responsibilities', v)}
                    />
                    <div className="pt-2 border-t border-neutral-900">
                      <button
                        onClick={() => removeExp(exp.id)}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors"
                      >
                        Delete entry
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// About Tab
// ─────────────────────────────────────────────

function AboutTab({ data, update, setData }: any) {
  const a = data.about;

  const updateSkills = (category: 'development' | 'community', items: string[]) => {
    setData((prev: any) => ({
      ...prev,
      about: { ...prev.about, skills: { ...prev.about.skills, [category]: items } },
    }));
  };

  return (
    <div className="space-y-5">
      <SectionTitle>About Page</SectionTitle>
      <Field label="Paragraph 1" value={a.intro1} onChange={(v) => update(['about', 'intro1'], v)} multiline />
      <Field label="Paragraph 2" value={a.intro2} onChange={(v) => update(['about', 'intro2'], v)} multiline />
      <Field label="Paragraph 3" value={a.intro3} onChange={(v) => update(['about', 'intro3'], v)} multiline />

      <div className="pt-2">
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-4">Skills</p>
        <div className="space-y-4">
          <ArrayField
            label="Development Skills"
            items={a.skills.development}
            onChange={(v) => updateSkills('development', v)}
          />
          <ArrayField
            label="Community & Operations Skills"
            items={a.skills.community}
            onChange={(v) => updateSkills('community', v)}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Contact Tab
// ─────────────────────────────────────────────

function ContactTab({ data, update }: any) {
  const c = data.contact;
  return (
    <div className="space-y-5">
      <SectionTitle>Contact Info</SectionTitle>
      <Field label="Email" value={c.email} onChange={(v) => update(['contact', 'email'], v)} />
      <Field label="Discord Username" value={c.discord} onChange={(v) => update(['contact', 'discord'], v)} />
      <Field label="GitHub Username" value={c.github} onChange={(v) => update(['contact', 'github'], v)} />
      <Field label="X / Twitter Handle" value={c.twitter} onChange={(v) => update(['contact', 'twitter'], v)} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Array field (tags, lists)
// ─────────────────────────────────────────────

function ArrayField({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setInput('');
  };

  const remove = (i: number) => {
    onChange(items.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-sm text-neutral-300"
          >
            {item}
            <button
              onClick={() => remove(i)}
              className="text-neutral-600 hover:text-red-400 transition-colors text-xs leading-none"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Type and press Enter"
          className="flex-1 bg-neutral-900 border border-neutral-800 text-white px-3 py-2 text-sm focus:outline-none focus:border-neutral-600 transition-colors"
        />
        <button
          onClick={add}
          className="px-3 py-2 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 text-sm transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

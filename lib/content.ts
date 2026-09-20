import { readFileSync } from 'fs';
import { join } from 'path';

export type SiteContent = {
  hero: {
    name: string;
    subtitle: string;
    description: string;
    status: string;
    focus: string;
    specialty: string;
    based: string;
  };
  about: {
    intro1: string;
    intro2: string;
    intro3: string;
    skills: {
      development: string[];
      community: string[];
    };
  };
  projects: {
    id: string;
    title: string;
    description: string;
    status: string;
    featured: boolean;
    role?: string;
    areas: string[];
    technologies: string[];
  }[];
  experience: {
    id: string;
    title: string;
    role: string;
    status: string;
    description: string;
    responsibilities: string[];
  }[];
  contact: {
    email: string;
    discord: string;
    github: string;
    twitter: string;
  };
};

export function getContent(): SiteContent {
  const path = join(process.cwd(), 'data', 'content.json');
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw);
}

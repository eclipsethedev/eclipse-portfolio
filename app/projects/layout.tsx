import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects — Eclipse',
  description: 'Web development and community projects by Eclipse.',
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

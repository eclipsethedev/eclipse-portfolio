import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience — Eclipse',
  description: 'Professional experience and project work by Eclipse.',
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

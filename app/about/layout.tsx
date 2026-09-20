import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Eclipse',
  description: 'Learn more about Eclipse, a developer working with web development and online communities.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Eclipse',
  description: 'Get in touch with Eclipse for development work, community opportunities, and collaborations.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

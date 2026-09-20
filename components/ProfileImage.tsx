'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProfileImageProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProfileImage({ size = 'md', className = '' }: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 profile-glow">
        {!imageError ? (
          <Image
            src="/profile.jpg"
            alt="Eclipse"
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'monochrome';
  showText?: boolean;
}

export function Logo({ 
  className, 
  width = 40, 
  height = 40,
  variant = 'default',
  showText = true 
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <div className="relative" style={{ width, height }}>
        <Image
          src="/enterpriseland-logo.png"
          alt="EnterpriseLand"
          fill
          className={cn(
            "object-contain",
            variant === 'monochrome' && "grayscale brightness-0 dark:brightness-100"
          )}
          priority
        />
      </div>
      {showText && (
        <span className="font-bold text-xl text-brand-deep-blue dark:text-white">
          EnterpriseLand
        </span>
      )}
    </Link>
  );
}

// Logo with clear space guidelines
export function LogoWithClearSpace({ 
  className,
  size = 'medium'
}: { 
  className?: string;
  size?: 'small' | 'medium' | 'large';
}) {
  const dimensions = {
    small: { width: 32, height: 32, padding: 'p-2' },
    medium: { width: 40, height: 40, padding: 'p-3' },
    large: { width: 56, height: 56, padding: 'p-4' },
  };

  const { width, height, padding } = dimensions[size];

  return (
    <div className={cn(padding, className)}>
      <Logo width={width} height={height} />
    </div>
  );
}
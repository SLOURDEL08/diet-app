'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  className?: string;
  iconPosition?: 'left' | 'right';
}

const variantStyles = {
  primary: 'bg-primary border-primary border-2 text-[#170312] hover:bg-[#C7EF00]/90',
  secondary: 'bg-[#170312] border-2 border-primary text-[#C7EF00] hover:bg-[#170312]/90',
  outline: 'border-2 border-transparent backdrop-blur-md bg-white/10 text-[#C7EF00] hover:bg-[#C7EF00]/10',
  ghost: 'text-[#C7EF00] border-2 border-transparent hover:bg-[#C7EF00]/10'
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-6 py-4 text-lg'
};

export function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = ''
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center 
    rounded-2xl font-medium transition-colors duration-200
    ${variantStyles[variant]} ${sizeStyles[size]} ${className}
  `;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="mr-2 h-5 w-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="ml-2 h-5 w-5" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseStyles}>
      {content}
    </button>
  );
}

export function Card({
  children,
  className = '',
  hover = true
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div 
      className={`
        bg-white rounded-3xl shadow-lg p-8
        ${hover ? 'hover:scale-105 transform transition-transform duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
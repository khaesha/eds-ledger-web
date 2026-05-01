import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={['bg-gray-900 rounded-xl border border-gray-800', paddingClasses[padding], className].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

import React from 'react';
import { variants } from '../../theme/config';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-lg';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };
  
  const variantStyle = variants.badge[variant] || variants.badge.primary;
  
  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyle} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />}
      {children}
    </span>
  );
};

export default Badge;

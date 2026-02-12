import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  const variantStyles = {
    primary: 'text-blue-600',
    secondary: 'text-slate-600',
    white: 'text-white',
  };
  
  return (
    <Loader2
      className={`animate-spin ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
      <Spinner size="xl" />
      <p className="text-slate-700 font-medium">{message}</p>
    </div>
  </div>
);

export const LoadingSpinner = ({ fullScreen = false, message }) => {
  if (fullScreen) {
    return <LoadingOverlay message={message} />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Spinner size="lg" />
      {message && <p className="text-slate-600 text-sm">{message}</p>}
    </div>
  );
};

export default Spinner;

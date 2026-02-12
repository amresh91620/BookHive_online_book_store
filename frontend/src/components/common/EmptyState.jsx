import React from 'react';
import Button from '../ui/Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {Icon && (
        <div className="inline-flex p-6 rounded-full bg-slate-100 mb-6">
          <Icon className="text-slate-400" size={48} />
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      )}
      
      {description && (
        <p className="text-slate-600 text-sm max-w-md mb-6">{description}</p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

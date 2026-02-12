import React from 'react';
import { AlertCircle } from 'lucide-react';
import { variants } from '../../theme/config';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  className = '',
  ...props
}) => {
  const variantStyle = error ? variants.input.error : variants.input.default;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={name} className="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {showCount && maxLength && (
            <span className="text-xs text-slate-500">
              {value?.length || 0}/{maxLength}
            </span>
          )}
        </div>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-2.5 bg-white border rounded-xl
          text-sm text-slate-900 placeholder:text-slate-400
          transition-all duration-200
          focus:outline-none resize-none
          disabled:opacity-60 disabled:cursor-not-allowed
          ${variantStyle}
        `}
        {...props}
      />
      
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1 ml-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Textarea;

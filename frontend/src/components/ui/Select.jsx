import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { variants } from '../../theme/config';

const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const variantStyle = error ? variants.input.error : variants.input.default;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700 ml-1 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 pr-10 bg-white border rounded-xl
            text-sm text-slate-900
            appearance-none cursor-pointer
            transition-all duration-200
            focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed
            ${variantStyle}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1 ml-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Select;

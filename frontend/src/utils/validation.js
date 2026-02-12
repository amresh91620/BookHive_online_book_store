// Validation Utilities

export const validators = {
  // Email validation
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Invalid email format';
    return '';
  },

  // Password validation
  password: (value, minLength = 6) => {
    if (!value) return 'Password is required';
    if (value.length < minLength) return `Password must be at least ${minLength} characters`;
    return '';
  },

  // Confirm password validation
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  },

  // Name validation
  name: (value, minLength = 2) => {
    if (!value) return 'Name is required';
    if (value.trim().length < minLength) return `Name must be at least ${minLength} characters`;
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
    return '';
  },

  // Phone validation
  phone: (value) => {
    if (!value) return 'Phone number is required';
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Invalid phone number';
    return '';
  },

  // Required field validation
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return '';
  },

  // Number validation
  number: (value, min, max) => {
    if (!value && value !== 0) return 'This field is required';
    const num = Number(value);
    if (isNaN(num)) return 'Must be a valid number';
    if (min !== undefined && num < min) return `Must be at least ${min}`;
    if (max !== undefined && num > max) return `Must be at most ${max}`;
    return '';
  },

  // URL validation
  url: (value) => {
    if (!value) return 'URL is required';
    try {
      new URL(value);
      return '';
    } catch {
      return 'Invalid URL format';
    }
  },

  // OTP validation
  otp: (value, length = 6) => {
    if (!value) return 'OTP is required';
    if (value.length !== length) return `OTP must be ${length} digits`;
    if (!/^\d+$/.test(value)) return 'OTP must contain only numbers';
    return '';
  },

  // Price validation
  price: (value) => {
    if (!value && value !== 0) return 'Price is required';
    const num = Number(value);
    if (isNaN(num)) return 'Must be a valid number';
    if (num < 0) return 'Price cannot be negative';
    return '';
  },

  // Stock validation
  stock: (value) => {
    if (!value && value !== 0) return 'Stock is required';
    const num = Number(value);
    if (isNaN(num)) return 'Must be a valid number';
    if (num < 0) return 'Stock cannot be negative';
    if (!Number.isInteger(num)) return 'Stock must be a whole number';
    return '';
  },
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];
    
    if (typeof rule === 'function') {
      const error = rule(value);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      for (const validator of rule) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Real-time field validation
export const validateField = (name, value, rules) => {
  if (!rules[name]) return '';
  
  const rule = rules[name];
  
  if (typeof rule === 'function') {
    return rule(value);
  } else if (Array.isArray(rule)) {
    for (const validator of rule) {
      const error = validator(value);
      if (error) return error;
    }
  }
  
  return '';
};

export default validators;

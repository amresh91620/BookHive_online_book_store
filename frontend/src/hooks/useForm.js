import { useState, useCallback } from 'react';
import { validateField, validateForm } from '../utils/validation';

const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);
  
  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate field on blur
    if (validationRules[name]) {
      const error = validateField(name, values[name], validationRules);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [values, validationRules]);
  
  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  
  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);
  
  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Validate all fields
  const validate = useCallback(() => {
    const validation = validateForm(values, validationRules);
    setErrors(validation.errors);
    return validation.isValid;
  }, [values, validationRules]);
  
  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e) {
        e.preventDefault();
      }
      
      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      
      // Validate form
      const isValid = validate();
      
      if (!isValid) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validationRules, validate]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validate,
    setValues,
    setErrors,
  };
};

export default useForm;

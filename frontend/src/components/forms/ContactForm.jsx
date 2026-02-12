import React from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';
import { Input, Textarea, Button, Card } from '../ui';
import useForm from '../../hooks/useForm';
import { validators } from '../../utils/validation';
import showToast from '../../utils/toast';

const ContactForm = ({ onSubmit }) => {
  const initialValues = {
    name: '',
    email: '',
    message: '',
  };
  
  const validationRules = {
    name: validators.name,
    email: validators.email,
    message: (value) => validators.required(value, 'Message'),
  };
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm(initialValues, validationRules);
  
  const onFormSubmit = async (formData) => {
    try {
      await onSubmit(formData);
      showToast.success('Message sent successfully!');
      resetForm();
    } catch (error) {
      showToast.error(error.response?.data?.msg || 'Failed to send message');
    }
  };
  
  return (
    <Card variant="elevated" padding="lg">
      <Card.Header>
        <Card.Title>Get in Touch</Card.Title>
        <Card.Description>
          Fill out the form below and we'll get back to you as soon as possible.
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : ''}
            placeholder="John Doe"
            icon={User}
            required
          />
          
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
            placeholder="john@example.com"
            icon={Mail}
            required
          />
          
          <Textarea
            label="Message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.message ? errors.message : ''}
            placeholder="Tell us what's on your mind..."
            rows={5}
            maxLength={500}
            showCount
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            icon={MessageSquare}
          >
            Send Message
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
};

export default ContactForm;

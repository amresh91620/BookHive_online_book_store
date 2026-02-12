import React from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import { sendMessageApi } from "../services/authApi";
import { Card, Badge } from "../components/ui";
import ContactForm from "../components/forms/ContactForm";
import { CONTACT_INFO } from "../config/site";

const ContactUs = () => {
  const contactCards = [
    {
      title: "Email",
      value: CONTACT_INFO.email,
      icon: Mail,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Phone",
      value: CONTACT_INFO.phone,
      icon: Phone,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Address",
      value: CONTACT_INFO.addressLines,
      icon: MapPin,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Hours",
      value: CONTACT_INFO.hours,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">
            Contact Us
          </Badge>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black">
            We'd love to hear from you
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Have a question about a book, an order, or your account? Send us a
            message and we'll respond quickly.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          {/* Left Section */}
          <div className="space-y-6">
            <Card variant="elevated" padding="lg">
              <Card.Header>
                <Card.Title>Contact Information</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-5">
                  {contactCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex gap-4">
                        <div className={`${item.bg} p-3 rounded-2xl flex-shrink-0`}>
                          <Icon className={item.color} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          {Array.isArray(item.value) ? (
                            <p className="text-slate-600">
                              {item.value.map((line) => (
                                <span key={line} className="block">
                                  {line}
                                </span>
                              ))}
                            </p>
                          ) : (
                            <p className="text-slate-600">{item.value}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" padding="lg" className="bg-slate-900 text-white border-slate-900">
              <Card.Header>
                <Card.Title className="text-white">Why contact us?</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    Quick responses within 24 hours
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    Order, account, and book help
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    Friendly reader support
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Contact Form */}
          <ContactForm onSubmit={sendMessageApi} />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Contact <span className="text-green-600">Us</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Have questions, feedback, or suggestions?  
          We’d love to hear from you. Get in touch with the BookHive team.
        </p>
      </div>

      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📞 Get in Touch
          </h2>

          <div className="flex items-center gap-4">
            <Mail className="text-green-600" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">support@bookhive.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="text-green-600" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="text-green-600" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-gray-600">
                BookHive HQ, Tech Park,<br />
                New Delhi, India
              </p>
            </div>
          </div>

          <p className="text-gray-600 pt-4">
            Our team usually responds within 24 hours.  
            Your feedback helps us improve BookHive every day.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ✉ Send us a Message
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

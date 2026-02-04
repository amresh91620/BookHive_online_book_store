import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { sendMessageApi } from "../services/authApi";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await sendMessageApi(formData);
      toast.success(response.msg || "Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Contact Us
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black">
            We’d love to hear from you
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Have a question about a book, an order, or your account? Send us a
            message and we’ll respond quickly.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          {/* Left Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl">
                    <Mail className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-slate-600">support@bookhive.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl">
                    <Phone className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-violet-50 p-3 rounded-2xl">
                    <MapPin className="text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-slate-600">
                      123 Library Lane, Suite 100
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-amber-50 p-3 rounded-2xl">
                    <Clock className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="text-slate-600">Mon–Sat, 9:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6">
              <h3 className="text-xl font-bold mb-4">Why contact us?</h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  Quick responses within 24 hours
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  Order, account, and book help
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" />
                  Friendly reader support
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Your Message
                </label>
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl resize-none outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 py-4 rounded-2xl text-white font-semibold ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {loading ? "Sending..." : <><Send /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

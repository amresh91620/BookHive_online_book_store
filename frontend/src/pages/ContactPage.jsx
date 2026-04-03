import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Clock,
  Headphones,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fieldClassName =
  "h-[52px] rounded-[20px] border-[#d8e6e1] bg-white/92 text-slate-800 placeholder:text-slate-400 shadow-none focus-visible:ring-[#d97642]/20 focus-visible:border-[#d97642]";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [heroRef, heroVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation();
  const [contactInfoRef, contactInfoVisible] = useScrollAnimation();
  const [faqRef, faqVisible] = useScrollAnimation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/contact`, formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@bookhive.com",
      note: "Best for orders, account help, and general questions",
      link: "mailto:support@bookhive.com",
    },
    {
      icon: Phone,
      title: "Call Support",
      content: "+91 91232 33736",
      note: "Talk to us during our business hours",
      link: "tel:+91 91232 33736",
    },
    {
      icon: MapPin,
      title: "Visit Office",
      content: "123 Book Street, Reading City, RC 12345",
      note: "Our fulfillment and support coordination center",
      link: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM",
      note: "Typical response time is within one business day",
      link: null,
    },
  ];


  const supportHighlights = [
    { value: "<24h", label: "Average reply window" },
    { value: "7 days", label: "Weekly support coverage" },
    { value: "Human", label: "Reader-first help" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ef] pb-20">
      <section className="page-wash relative overflow-hidden pb-10 border-b border-[#d8e6e1]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(151,234,220,0.36),transparent_30%),radial-gradient(circle_at_85%_14%,rgba(241,208,136,0.24),transparent_24%)]" />

        <div className="container-shell relative py-12 sm:py-14 lg:py-16">
            <div
              ref={heroRef}
              className={cn(
                "transition-all duration-700",
                heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
            >
              <h1 className=" text-[clamp(2.6rem,6vw,5.2rem)] font-semibold leading-[0.96] tracking-tight text-slate-900">
                Questions, support, or a quick hello{" "}
                <span className="gradient-text">we are here for it</span>
              </h1>
              <p className="mt-10 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Reach out for order help, recommendations, account questions, or anything else
                related to your reading experience. We aim to keep support as calm and
                reader-friendly as the storefront itself.
              </p>

              <div className="mt-20 grid gap-8 sm:grid-cols-3">
                {supportHighlights.map((item) => (
                  <div key={item.label} className="surface-card rounded-[24px] px-4 py-4">
                    <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      <section className="container-shell py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            ref={formRef}
            className={cn(
              "surface-panel rounded-[34px] transition-all duration-700",
              formVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            <div className="border-b border-[#d8e6e1]  px-6 pb-5 pt-6 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6f8883]">
                Send A Message
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                We would love to hear from you.
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Share your question and our team will get back to you as soon as possible.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="rounded-full border-[#d97642]/20 bg-white/85 px-6 text-[#d97642] hover:bg-[#fef3ed]"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className={fieldClassName}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className={fieldClassName}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-semibold text-slate-700">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What can we help you with?"
                      className={fieldClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-slate-700">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={7}
                      placeholder="Tell us more about your question, order, or request..."
                      className="min-h-[190px] rounded-[28px] border-[#d8e6e1] bg-white/92 text-slate-800 placeholder:text-slate-400 shadow-none focus-visible:border-[#d97642] focus-visible:ring-[#d97642]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-7 text-slate-500">
                      By sending this form, you agree that our team may contact you about your request.
                    </p>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 rounded-full bg-[#d97642] px-7 text-sm font-semibold text-white hover:bg-[#c26535] disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div
            ref={contactInfoRef}
            className={cn(
              "space-y-6 transition-all duration-700",
              contactInfoVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
            style={{ transitionDelay: "120ms" }}
          >
            <div className="surface-panel rounded-[32px] p-6 sm:p-7">
              <div className="border-b border-[#d8e6e1] pb-5">
                <h2 className="text-2xl font-semibold text-slate-900">Contact Information</h2>
              </div>

              <div className="space-y-4 pt-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  const content = info.link ? (
                    <a
                      href={info.link}
                      className="font-medium text-[#d97642] transition-colors hover:text-[#c26535]"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-900">{info.content}</span>
                  );

                  return (
                    <div key={info.title} className="surface-card rounded-[24px] px-5 py-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef3ed] text-[#d97642]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-slate-900">{info.title}</p>
                          <div className="mt-1 text-sm">{content}</div>
                          <p className="mt-1 text-sm leading-6 text-slate-500">{info.note}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

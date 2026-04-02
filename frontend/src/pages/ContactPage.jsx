import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const fieldClassName =
  "h-[52px] rounded-[20px] border-[#d8e6e1] bg-white/92 text-slate-800 placeholder:text-slate-400 shadow-none focus-visible:ring-[#0b7a71]/20 focus-visible:border-[#0b7a71]";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [heroRef, heroVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation();
  const [contactInfoRef, contactInfoVisible] = useScrollAnimation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
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
      content: "+1 (555) 123-4567",
      note: "Talk to us during our business hours",
      link: "tel:+15551234567",
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

  const quickAnswers = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping usually takes 3-5 business days depending on your location.",
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase for eligible orders.",
    },
    {
      question: "Do you ship internationally?",
      answer: "At the moment, we only ship within the United States.",
    },
  ];

  const supportHighlights = [
    { value: "<24h", label: "Average reply window" },
    { value: "7 days", label: "Weekly support coverage" },
    { value: "Human", label: "Reader-first help" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ef] pb-20">
      <section className="page-wash relative overflow-hidden border-b border-[#d8e6e1]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(151,234,220,0.36),transparent_30%),radial-gradient(circle_at_85%_14%,rgba(241,208,136,0.24),transparent_24%)]" />

        <div className="container-shell relative py-12 sm:py-14 lg:py-16">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_380px] xl:items-end">
            <div
              ref={heroRef}
              className={cn(
                "transition-all duration-700",
                heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
            >
              <span className="brand-chip">Contact BookHive</span>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,6vw,5.2rem)] font-semibold leading-[0.96] tracking-tight text-slate-900">
                Questions, support, or a quick hello{" "}
                <span className="gradient-text">we are here for it</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Reach out for order help, recommendations, account questions, or anything else
                related to your reading experience. We aim to keep support as calm and
                reader-friendly as the storefront itself.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {supportHighlights.map((item) => (
                  <div key={item.label} className="surface-card rounded-[24px] px-4 py-4">
                    <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel rounded-[34px] p-6 sm:p-7">
              <div className="rounded-[28px] bg-[#102032] px-5 py-5 text-white shadow-[0_24px_50px_rgba(16,32,50,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">
                  Support Promise
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight">
                  Friendly help designed around real readers.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/84">
                  We try to keep every support interaction clear, human, and actually useful from the first message.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div className="surface-card rounded-[24px] px-5 py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecf8f5] text-[#0b7a71]">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">Personal Assistance</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        Order support, delivery questions, and product help that stays practical and quick.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="surface-card rounded-[24px] px-5 py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecf8f5] text-[#0b7a71]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">Fast Follow-up</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">
                        We try to respond quickly so your next read is never slowed down by unanswered questions.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/faq"
                  className="flex items-center justify-between rounded-[24px] border border-[#d8e6e1] bg-white/88 px-5 py-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#edf7f4] hover:text-[#0b7a71]"
                >
                  Browse frequently asked questions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            ref={formRef}
            className={cn(
              "surface-panel rounded-[34px] transition-all duration-700",
              formVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            <div className="border-b border-[#d8e6e1] bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(244,249,247,0.75)_100%)] px-6 pb-5 pt-6 sm:px-8">
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="min-h-[190px] rounded-[28px] border-[#d8e6e1] bg-white/92 text-slate-800 placeholder:text-slate-400 shadow-none focus-visible:border-[#0b7a71] focus-visible:ring-[#0b7a71]/20"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-7 text-slate-500">
                    By sending this form, you agree that our team may contact you about your request.
                  </p>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-full bg-[#0b7a71] px-7 text-sm font-semibold text-white hover:bg-[#095f59]"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
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
                      className="font-medium text-[#0b7a71] transition-colors hover:text-[#095f59]"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <span className="font-medium text-slate-900">{info.content}</span>
                  );

                  return (
                    <div key={info.title} className="surface-card rounded-[24px] px-5 py-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecf8f5] text-[#0b7a71]">
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

            <div className="surface-panel rounded-[32px] p-6 sm:p-7">
              <div className="border-b border-[#d8e6e1] pb-5">
                <h2 className="text-2xl font-semibold text-slate-900">Quick Answers</h2>
              </div>

              <div className="space-y-4 pt-6">
                {quickAnswers.map((item) => (
                  <div key={item.question} className="surface-card rounded-[24px] px-5 py-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ecf8f5] text-[#0b7a71]">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{item.question}</p>
                        <p className="mt-1 text-sm leading-7 text-slate-600">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[26px] bg-[#102032] px-5 py-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-7 text-white/88">
                    If your question is urgent, email or phone usually gets the fastest response.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Headphones, HelpCircle, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fieldClassName =
  "h-12 rounded-2xl border-amber-100 bg-white/90 text-[#451a03] placeholder:text-[#9b7b5f] focus-visible:ring-[#d97706]";

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
    } catch (error) {
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
      answer: "Standard shipping usually takes 3-5 business days depending on your location.",
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
    <div className="min-h-screen">
      <section className="border-b border-amber-100/80 py-10 sm:py-10 lg:py-10">
        <div className="container-shell">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div
              ref={heroRef}
              className={`transition-all duration-700 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Badge className="mb-5 border-0 bg-[#1f2937] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100">
                Contact BookHive
              </Badge>
              <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-[#451a03] sm:text-5xl lg:text-6xl">
                Questions, order help, or just want to say hello?
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6b4a2a] sm:text-lg">
                We are here to help with book recommendations, order updates, account questions, and anything else you need. Reach out through the form or use the contact options below.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {supportHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-amber-100 bg-white/80 px-4 py-4 shadow-sm"
                  >
                    <p className="text-2xl font-bold text-[#451a03]">{item.value}</p>
                    <p className="mt-1 text-sm text-[#7c5b3d]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden rounded-[32px] border-amber-100 bg-white/90 shadow-[0_20px_60px_rgba(120,53,15,0.12)] backdrop-blur">
              <CardContent className="p-0">
                <div className="border-b border-amber-100 bg-[#1f2937] px-6 py-6 text-white sm:px-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Support Promise</p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl">
                    Friendly support designed around real readers.
                  </h2>
                </div>
                <div className="space-y-4 px-6 py-6 sm:px-8">
                  <div className="rounded-2xl border border-amber-100 bg-[#fff8ef] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1d8] text-[#b45309]">
                        <Headphones className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-serif text-lg font-semibold text-[#451a03]">Personal Assistance</p>
                        <p className="text-sm text-[#7c5b3d]">Order support, delivery questions, and product help.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-amber-100 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="mt-1 h-5 w-5 text-[#b45309]" />
                      <div>
                        <p className="font-serif text-lg font-semibold text-[#451a03]">Fast Follow-up</p>
                        <p className="mt-1 text-sm leading-7 text-[#6b4a2a]">
                          We try to respond quickly so your next read is never held up by unanswered questions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/faq"
                    className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white px-5 py-4 text-sm font-semibold text-[#78350f] transition-colors hover:bg-amber-50"
                  >
                    Browse frequently asked questions
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Card
              ref={formRef}
              className={`rounded-[30px] border-amber-100 bg-white/90 shadow-[0_14px_40px_rgba(120,53,15,0.08)] transition-all duration-700 ${
                formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <CardHeader className="border-b border-amber-100 bg-[linear-gradient(180deg,#fff7e8_0%,#fffdf8_100%)] pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b45309]">
                  Send a Message
                </p>
                <CardTitle className="font-serif text-3xl text-[#451a03]">
                  We would love to hear from you.
                </CardTitle>
                <p className="text-sm leading-7 text-[#6b4a2a]">
                  Share your question and our team will get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-[#5b3a1e]">
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
                      <Label htmlFor="email" className="text-sm font-semibold text-[#5b3a1e]">
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
                    <Label htmlFor="subject" className="text-sm font-semibold text-[#5b3a1e]">
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
                    <Label htmlFor="message" className="text-sm font-semibold text-[#5b3a1e]">
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
                      className="min-h-[180px] rounded-3xl border-amber-100 bg-white/90 text-[#451a03] placeholder:text-[#9b7b5f] focus-visible:ring-[#d97706]"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-7 text-[#7c5b3d]">
                      By sending this form, you agree that our team may contact you about your request.
                    </p>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 text-sm font-semibold text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div
              ref={contactInfoRef}
              className={`space-y-6 transition-all duration-700 ${
                contactInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <Card className="rounded-[28px] border-amber-100 bg-white/90 shadow-sm">
                <CardHeader className="border-b border-amber-100 pb-5">
                  <CardTitle className="font-serif text-2xl text-[#451a03]">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    const content = info.link ? (
                      <a
                        href={info.link}
                        className="font-medium text-[#b45309] transition-colors hover:text-[#92400e]"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <span className="font-medium text-[#451a03]">{info.content}</span>
                    );

                    return (
                      <div
                        key={info.title}
                        className="rounded-2xl border border-amber-100 bg-[#fffaf2] p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1d8] text-[#b45309]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif text-lg font-semibold text-[#451a03]">
                              {info.title}
                            </p>
                            <div className="mt-1 text-sm">{content}</div>
                            <p className="mt-1 text-sm leading-6 text-[#7c5b3d]">{info.note}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-amber-100 bg-[linear-gradient(180deg,#fff7e8_0%,#fffdf8_100%)] shadow-sm">
                <CardHeader className="border-b border-amber-100 pb-5">
                  <CardTitle className="font-serif text-2xl text-[#451a03]">
                    Quick Answers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {quickAnswers.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-2xl border border-amber-100 bg-white/85 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="mt-1 h-5 w-5 text-[#b45309]" />
                        <div>
                          <p className="font-serif text-lg font-semibold text-[#451a03]">
                            {item.question}
                          </p>
                          <p className="mt-1 text-sm leading-7 text-[#6b4a2a]">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

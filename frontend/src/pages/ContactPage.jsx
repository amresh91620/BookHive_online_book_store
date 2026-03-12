import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
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
      title: "Email",
      content: "support@bookhive.com",
      link: "mailto:support@bookhive.com",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Book Street, Reading City, RC 12345",
      link: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378350f' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
      <div className="container-shell relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-[#451a03] mb-4">Contact Us</h1>
            <p className="text-lg text-[#78350F] font-serif italic mx-auto">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-[#E5E5E5] shadow-md">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="font-serif text-2xl text-[#451a03]">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="focus-visible:ring-[#D97706]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-gray-700 font-medium">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What is this about?"
                        className="focus-visible:ring-[#D97706]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-gray-700 font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us more..."
                        className="focus-visible:ring-[#D97706]"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full md:w-auto bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] font-serif tracking-wide px-8 transition-colors">
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white border-[#E5E5E5] shadow-sm">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="font-serif text-xl text-[#451a03]">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = info.link ? (
                      <a
                        href={info.link}
                        className="text-[#D97706] hover:text-[#B45309] transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <span className="text-gray-700">{info.content}</span>
                    );

                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="bg-[#FEF3C7] p-2.5 rounded-lg border border-[#FDE68A]">
                          <Icon className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-[#451a03]">{info.title}</p>
                          <div className="text-sm text-gray-600 mt-0.5">{content}</div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E5E5] shadow-sm">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="font-serif text-xl text-[#451a03]">FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <p className="font-serif font-semibold text-[#451a03] mb-1">How long does shipping take?</p>
                    <p className="text-sm text-gray-600">
                      Standard shipping takes 3-5 business days.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <p className="font-serif font-semibold text-[#451a03] mb-1">What is your return policy?</p>
                    <p className="text-sm text-gray-600">
                      We accept returns within 30 days of purchase.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <p className="font-serif font-semibold text-[#451a03] mb-1">Do you ship internationally?</p>
                    <p className="text-sm text-gray-600">
                      Currently, we only ship within the United States.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
      </div>
    </div>
  );
}

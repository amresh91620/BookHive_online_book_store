import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          q: "How long does shipping take?",
          a: "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business days delivery.",
        },
        {
          q: "Do you ship internationally?",
          a: "Currently, we only ship within the United States. We're working on expanding our shipping to international locations soon.",
        },
        {
          q: "How can I track my order?",
          a: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.",
        },
        {
          q: "What are the shipping costs?",
          a: "We offer free standard shipping on all orders. Express shipping is available for an additional fee calculated at checkout.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your return policy?",
          a: "We accept returns within 30 days of purchase. Books must be in original condition with no markings or damage.",
        },
        {
          q: "How do I return a book?",
          a: "Log into your account, go to your order history, and select the order you want to return. Follow the instructions to initiate a return.",
        },
        {
          q: "When will I receive my refund?",
          a: "Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method.",
        },
        {
          q: "Can I exchange a book?",
          a: "Yes, you can exchange a book for another title. Please contact our customer service team to arrange an exchange.",
        },
      ],
    },
    {
      category: "Account & Payment",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' in the top right corner, enter your email, verify it with the OTP sent to your email, and complete your profile.",
        },
        {
          q: "What payment methods do you accept?",
          a: "Currently, we accept Cash on Delivery (COD). We're working on adding more payment options including credit cards and digital wallets.",
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use industry-standard encryption to protect your personal and payment information.",
        },
        {
          q: "Can I save multiple addresses?",
          a: "Yes, you can save multiple delivery addresses in your account profile for faster checkout.",
        },
      ],
    },
    {
      category: "Books & Inventory",
      questions: [
        {
          q: "How do I know if a book is in stock?",
          a: "Stock availability is shown on each book's detail page. If a book is out of stock, you can add it to your wishlist to be notified when it's available.",
        },
        {
          q: "Can I pre-order upcoming releases?",
          a: "Pre-order functionality is coming soon. Follow us on social media for updates on new releases.",
        },
        {
          q: "Do you sell e-books?",
          a: "Currently, we only sell physical books. E-book options may be available in the future.",
        },
        {
          q: "How do I find a specific book?",
          a: "Use the search bar at the top of the page to search by title, author, or ISBN. You can also browse by category.",
        },
      ],
    },
    {
      category: "Wishlist & Cart",
      questions: [
        {
          q: "How do I add books to my wishlist?",
          a: "Click the heart icon on any book card or detail page to add it to your wishlist. You must be logged in to use this feature.",
        },
        {
          q: "Can I share my wishlist?",
          a: "Wishlist sharing functionality is coming soon in a future update.",
        },
        {
          q: "How long do items stay in my cart?",
          a: "Items remain in your cart for 30 days. After that, they'll be automatically removed.",
        },
        {
          q: "Can I save my cart for later?",
          a: "Yes, your cart is automatically saved when you're logged in. You can access it from any device.",
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container-shell">
          {/* Header */}
          <div
            ref={headerRef}
            className={`text-center mb-12 transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-4xl font-bold font-serif text-[#451a03] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-[#6b4a2a]">
              Find answers to common questions about BookHive
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">{category.category}</h2>
                <div className="space-y-3">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <Card key={questionIndex} className="overflow-hidden border-amber-100 bg-white/90 backdrop-blur rounded-[28px] shadow-sm">
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full text-left p-6 hover:bg-amber-50 transition"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-[#451a03] pr-4">
                              {faq.q}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#7c5b3d] flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        {isOpen && (
                          <CardContent className="px-6 pb-6 pt-0">
                            <p className="text-[#6b4a2a] leading-relaxed">{faq.a}</p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <Card
            ref={ctaRef}
            className={`mt-12 bg-[linear-gradient(180deg,#fff7e8_0%,#fffdf8_100%)] border-amber-100 transition-all duration-700 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold font-serif text-[#451a03] mb-2">
                Still have questions?
              </h3>
              <p className="text-[#6b4a2a] mb-6">
                Can't find the answer you're looking for? Please contact our customer support team.
              </p>
              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-md font-medium hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}

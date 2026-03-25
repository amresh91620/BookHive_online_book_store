import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container-shell">
          <h1 className="text-4xl font-bold font-serif text-[#451a03] mb-4">
            Terms of Service
          </h1>
          <p className="text-[#7c5b3d] mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <Card className="mb-6 border-amber-100 bg-white/90 shadow-[0_14px_40px_rgba(120,53,15,0.08)] rounded-[30px]">
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  By accessing and using BookHive, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do
                  not agree to these terms, please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  2. Use of Service
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed mb-3">
                  You agree to use BookHive only for lawful purposes and in
                  accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6b4a2a] ml-4">
                  <li>
                    Use the service in any way that violates any applicable law
                    or regulation
                  </li>
                  <li>
                    Impersonate or attempt to impersonate BookHive or another
                    user
                  </li>
                  <li>
                    Engage in any conduct that restricts or inhibits anyone's
                    use of the service
                  </li>
                  <li>Use any automated system to access the service</li>
                  <li>
                    Attempt to gain unauthorized access to any part of the
                    service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  3. Account Registration
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  To access certain features, you must register for an account.
                  You agree to provide accurate, current, and complete
                  information during registration and to update such information
                  to keep it accurate, current, and complete. You are
                  responsible for safeguarding your password and for all
                  activities under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  4. Orders and Payment
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed mb-3">
                  When you place an order through BookHive:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6b4a2a] ml-4">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment must be made at the time of delivery (COD)</li>
                  <li>
                    You are responsible for providing accurate delivery
                    information
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  5. Shipping and Delivery
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We will make reasonable efforts to deliver your order within
                  the estimated timeframe. However, we are not responsible for
                  delays caused by circumstances beyond our control. Risk of
                  loss and title for items pass to you upon delivery.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  6. Returns and Refunds
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We accept returns within 30 days of purchase for items in
                  original condition. Refunds will be processed within 5-7
                  business days of receiving the returned item. Shipping costs
                  are non-refundable unless the return is due to our error.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  7. Intellectual Property
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  The service and its original content, features, and
                  functionality are owned by BookHive and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  BookHive shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages resulting from
                  your use of or inability to use the service. Our total
                  liability shall not exceed the amount paid by you for the
                  specific product or service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  9. Indemnification
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  You agree to indemnify and hold BookHive harmless from any
                  claims, damages, losses, liabilities, and expenses arising out
                  of your use of the service or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  10. Termination
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We may terminate or suspend your account and access to the
                  service immediately, without prior notice, for any reason,
                  including breach of these Terms. Upon termination, your right
                  to use the service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  11. Changes to Terms
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We reserve the right to modify these Terms at any time. We
                  will notify you of any changes by posting the new Terms on
                  this page. Your continued use of the service after such
                  modifications constitutes your acceptance of the updated
                  Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  12. Governing Law
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  These Terms shall be governed by and construed in accordance
                  with the laws of the United States, without regard to its
                  conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-serif text-[#451a03] mb-4">
                  13. Contact Information
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <div className="mt-4 p-4 bg-[#fff8ef] border border-amber-100 rounded-lg">
                  <p className="text-[#6b4a2a]">
                    <strong>Email:</strong> amresh91620@gmail.com
                  </p>
                  <p className="text-[#6b4a2a]">
                    <strong>Phone:</strong> +91 91232 33736
                  </p>
                  <p className="text-[#6b4a2a]">
                    <strong>Address:</strong> Miarwa, Siwan (Bihar)
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}

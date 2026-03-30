import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function PrivacyPolicyPage() {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation();
  
  return (
    <div className="min-h-screen py-12">
      <div className="container-shell">
          <h1
            ref={headerRef}
            className={`text-4xl font-bold text-[#451a03] font-serif mb-4 transition-all duration-700 ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Privacy Policy
          </h1>
          <p className="text-[#7c5b3d] mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <Card
            ref={contentRef}
            className={`mb-6 border-amber-100 bg-white/90 shadow-[0_14px_40px_rgba(120,53,15,0.08)] rounded-[30px] transition-all duration-700 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">1. Introduction</h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  Welcome to BookHive. We respect your privacy and are committed to protecting your
                  personal data. This privacy policy will inform you about how we look after your
                  personal data when you visit our website and tell you about your privacy rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">
                  2. Information We Collect
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed mb-3">
                  We may collect, use, store and transfer different kinds of personal data about
                  you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6b4a2a] ml-4">
                  <li>Identity Data: name, username, or similar identifier</li>
                  <li>Contact Data: email address, telephone numbers, and delivery addresses</li>
                  <li>Transaction Data: details about payments and orders</li>
                  <li>Technical Data: IP address, browser type, and device information</li>
                  <li>Usage Data: information about how you use our website</li>
                  <li>Marketing Data: your preferences in receiving marketing from us</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed mb-3">
                  We use your personal data for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#6b4a2a] ml-4">
                  <li>To process and deliver your orders</li>
                  <li>To manage your account and provide customer support</li>
                  <li>To send you important information about your orders</li>
                  <li>To improve our website and services</li>
                  <li>To send you marketing communications (with your consent)</li>
                  <li>To protect against fraud and ensure security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">4. Data Security</h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We have implemented appropriate security measures to prevent your personal data
                  from being accidentally lost, used, or accessed in an unauthorized way. We use
                  encryption technology and secure servers to protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">5. Data Retention</h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We will only retain your personal data for as long as necessary to fulfill the
                  purposes we collected it for, including for legal, accounting, or reporting
                  requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">6. Your Rights</h2>
                <p className="text-[#6b4a2a] leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-[#6b4a2a] ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">7. Cookies</h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website
                  and store certain information. You can instruct your browser to refuse all
                  cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">8. Third-Party Links</h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  Our website may include links to third-party websites. We have no control over
                  the content and practices of these sites and cannot accept responsibility for
                  their privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">
                  9. Changes to This Policy
                </h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  We may update our privacy policy from time to time. We will notify you of any
                  changes by posting the new privacy policy on this page and updating the "Last
                  updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#451a03] font-serif mb-4">10. Contact Us</h2>
                <p className="text-[#6b4a2a] leading-relaxed">
                  If you have any questions about this privacy policy or our privacy practices,
                  please contact us at:
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

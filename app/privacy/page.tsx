import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for ZENTA LawFirm WebSite"
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl py-16">
      <h1 className="mb-8 text-4xl font-serif text-brass">Privacy Policy</h1>
      
      <div className="prose prose-invert prose-parchment max-w-none space-y-6 text-parchment/90">
        <p className="text-sm text-parchment/60">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Introduction</h2>
          <p>
            This Privacy Policy describes how [Your Law Firm Name] (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects your personal information when you use our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Information We Collect</h2>
          <h3 className="text-xl font-serif text-parchment/90 mt-6 mb-3">Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email, phone number)</li>
            <li>Information submitted through contact forms</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-serif text-parchment/90 mt-6 mb-3">Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on our website</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respond to your inquiries and provide legal consultation</li>
            <li>Send updates about our services (with your consent)</li>
            <li>Improve our website and user experience</li>
            <li>Comply with legal obligations</li>
            <li>Protect against fraud and unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Third-Party Services</h2>
          <p>
            We may use third-party services (analytics, hosting) that collect information subject to their own privacy policies. We recommend reviewing their policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Children&apos;s Privacy</h2>
          <p>
            Our website is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-obsidian/50 rounded-lg">
            <p>[Your Law Firm Name]</p>
            <p>[Address]</p>
            <p>Email: [email@example.com]</p>
            <p>Phone: [phone number]</p>
          </div>
        </section>
      </div>
    </main>
  );
}

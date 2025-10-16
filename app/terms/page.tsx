import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for ZENTA LawFirm WebSite"
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl py-16">
      <h1 className="mb-8 text-4xl font-serif text-brass">Terms of Service</h1>
      
      <div className="prose prose-invert prose-parchment max-w-none space-y-6 text-parchment/90">
        <p className="text-sm text-parchment/60">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Agreement to Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Use of Website</h2>
          <p>
            This website is provided for informational purposes only. The content on this site does not constitute legal advice and should not be relied upon as such. For specific legal advice, please contact us directly.
          </p>
          
          <h3 className="text-xl font-serif text-parchment/90 mt-6 mb-3">Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any portion of the website</li>
            <li>Interfere with or disrupt the website or servers</li>
            <li>Transmit any viruses, malware, or harmful code</li>
            <li>Collect or harvest any information from the website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">No Attorney-Client Relationship</h2>
          <p>
            Use of this website does not create an attorney-client relationship between you and [Your Law Firm Name]. An attorney-client relationship is only formed after we have agreed to represent you and confirmed this in writing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of [Your Law Firm Name] or its content suppliers and is protected by international copyright laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Disclaimer of Warranties</h2>
          <p>
            This website is provided &quot;as is&quot; without any representations or warranties, express or implied. We make no representations or warranties in relation to this website or the information and materials provided.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we exclude all liability for any loss or damage arising from your use of this website or reliance on information provided herein.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">External Links</h2>
          <p>
            This website may contain links to external websites. We have no control over the content of these sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless [Your Law Firm Name] from any claims, losses, damages, liabilities, and expenses arising from your use of the website or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Modifications to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Severability</h2>
          <p>
            If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms of Service will otherwise remain in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-parchment mt-8 mb-4">Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
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

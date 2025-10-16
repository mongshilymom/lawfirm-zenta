import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our legal team. We're here to help with your legal needs."
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="mb-4 font-serif text-4xl text-parchment">
            Contact Us
          </h1>
          <p className="text-lg text-zinc-400">
            Have a question or need legal assistance? Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </header>

        <form 
          action="https://formspree.io/f/REPLACE_WITH_YOUR_FORMSPREE_ID" 
          method="POST"
          className="space-y-6 rounded-2xl border border-zinc-800 bg-obsidian/80 p-8"
        >
          {/* Name */}
          <div>
            <label 
              htmlFor="name" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label 
              htmlFor="email" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label 
              htmlFor="phone" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Subject */}
          <div>
            <label 
              htmlFor="subject" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="Legal consultation request"
            />
          </div>

          {/* Message */}
          <div>
            <label 
              htmlFor="message" 
              className="mb-2 block text-sm font-medium text-parchment"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-parchment placeholder:text-zinc-500 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/20"
              placeholder="Please describe your legal matter..."
            />
          </div>

          {/* Hidden field for spam protection */}
          <input type="hidden" name="_subject" value="New contact form submission" />
          <input type="hidden" name="_captcha" value="false" />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-brass px-6 py-3 font-medium text-ink transition-colors hover:bg-brass/90 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
          >
            Send Message
          </button>

          <p className="text-center text-sm text-zinc-500">
            By submitting this form, you agree to our <a href="/privacy" className="text-brass hover:underline">Privacy Policy</a> and <a href="/terms" className="text-brass hover:underline">Terms of Service</a>.
          </p>
        </form>
      </div>
    </main>
  );
}

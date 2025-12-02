import React from 'react';

const CookiePolicy: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Cookie & Tracking Technologies Policy</h1>
      <p className="text-charcoal-light mb-4">Effective Date: {new Date().getFullYear()}-01-01</p>
      <p className="text-charcoal-light mb-8">
        Last Updated:{' '}
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="prose prose-lg max-w-none space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <p className="font-semibold text-amber-800">
            This Cookie Policy explains how Nicole Marie Severson, Realtor® with eXp Realty, LLC (“we,” “us,” “our”) uses
            cookies and similar technologies on this website and within Nicole&apos;s Assistant (the AI chat experience).
            Please review this policy together with our <a href="/privacy" className="underline text-primary">Privacy Policy</a> and{' '}
            <a href="/terms" className="underline text-primary">Terms of Use</a>.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website. They help us provide essential
          functionality, remember your preferences, secure the site, and understand how visitors use our services.
          Related technologies include local storage, session storage, pixels, tags, and scripts.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">2. Types of Cookies We Use</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Strictly Necessary:</strong> Required for core site features (security, load balancing, authentication).
            These cannot be disabled and do not store personally identifying information.
          </li>
          <li>
            <strong>Performance & Analytics:</strong> Help us understand site performance, property interest, and chat usage.
            These cookies are only activated when you provide consent.
          </li>
          <li>
            <strong>Functional:</strong> Remember your preferences (saved listings, cookie choices, contact preferences) to
            provide a tailored experience.
          </li>
          <li>
            <strong>Marketing & Lead Attribution:</strong> Track engagement with marketing campaigns or embedded partner
            widgets. These are optional and disabled by default unless you opt in.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal">3. First-Party vs. Third-Party Cookies</h2>
        <p>
          We set first-party cookies via this website to remember your preferences and maintain session security.
          Third-party providers (e.g., Supabase, Vercel analytics, Google Gemini, scheduling/lead capture tools) may set
          additional cookies when their services are embedded. These third parties operate under their own privacy policies.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">4. Local Storage & Similar Technologies</h2>
        <p>
          In limited cases we store information in your browser via localStorage or sessionStorage (for example, managed
          property templates or cookie preferences). These values remain on your device and can be cleared via your browser
          settings at any time.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">5. Managing Your Preferences</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Use the Cookie Consent banner or the “Cookie Preferences” link in the footer to accept, reject, or fine-tune
            non-essential cookies.
          </li>
          <li>
            Adjust browser settings to block or delete cookies (note that core site functionality may be impacted).
          </li>
          <li>
            Opt out of interest-based advertising via resources such as{' '}
            <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="underline text-primary">
              National Advertising Initiative
            </a>{' '}
            or{' '}
            <a href="https://youradchoices.com" target="_blank" rel="noopener noreferrer" className="underline text-primary">
              YourAdChoices
            </a>.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal">6. Data Retention</h2>
        <p>
          Cookie preferences are stored for up to 12 months, after which we may request consent again to keep your settings
          current. Analytics data is aggregated and retained per the policies of each respective vendor.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">7. Do Not Sell / Share Signals</h2>
        <p>
          California residents may exercise their “Do Not Sell or Share My Personal Information” rights via the{' '}
          <a href="/privacy#do-not-sell" className="underline text-primary">Privacy Policy</a>. We honor Global Privacy Control (GPC)
          signals by disabling non-essential cookies when such signals are detected by supported browsers.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">8. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy to reflect operational, legal, or regulatory changes. Updates will be posted on
          this page with a revised effective date. Your continued use of the site after an update indicates acceptance.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">9. Contact</h2>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="font-semibold">Questions about cookies or tracking technologies?</p>
          <p>Email <a href="mailto:nicole@exppgh.com" className="text-primary underline">nicole@exppgh.com</a> or call{' '}
            <a href="tel:510-313-3291" className="text-primary underline">(510) 313-3291</a>.</p>
        </div>
      </div>
    </div>
  </section>
);

export default CookiePolicy;


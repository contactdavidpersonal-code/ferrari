import React from 'react';

const Accessibility: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Accessibility Statement</h1>
      <p className="text-charcoal-light mb-4">Effective Date: {new Date().getFullYear()}-01-01</p>
      <p className="text-charcoal-light mb-8">
        Last Updated:{' '}
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="prose prose-lg max-w-none space-y-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="font-semibold text-blue-800">
            We are committed to providing an accessible, ADA-compliant digital experience. This Accessibility Statement
            applies to this website, mobile experience, and Nicole&apos;s Assistant (our AI-powered chat interface).
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal">1. Commitment to WCAG 2.1 AA</h2>
        <p>
          Our goal is to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We routinely audit this
          site with automated scans and manual testing to verify color contrast, keyboard accessibility, semantic
          structure, and compatibility with assistive technologies.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">2. Accessibility Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Semantic HTML structure, ARIA roles, and descriptive labels for interactive elements</li>
          <li>Keyboard focus styles and skip-to-content patterns</li>
          <li>Responsive layout that supports zooming up to 200% without loss of content</li>
          <li>Alt text for meaningful imagery and decorative treatment for ornamental assets</li>
          <li>Accessible form labels, error messaging, and manageable tab order</li>
          <li>High-contrast palette aligned with WCAG minimum requirements</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal">3. Nicole&apos;s Assistant (AI Chat)</h2>
        <p>
          The chat experience supports keyboard input, screen-reader friendly announcements, and descriptive buttons. If
          you encounter barriers while using the assistant, please contact us so we can assist you directly and improve the
          feature.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">4. Known Limitations</h2>
        <p>
          Some third-party content (embedded maps, MLS iframes, video players, scheduling widgets) may not fully meet WCAG
          2.1 AA. We work with partners to encourage accessible experiences and will assist users with alternative formats
          upon request.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">5. Requesting Assistance</h2>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="font-semibold">Need help accessing information or scheduling an appointment?</p>
          <ul className="list-disc pl-6 space-y-1 mt-3">
            <li>Email <a href="mailto:nicole@exppgh.com" className="text-primary underline">nicole@exppgh.com</a></li>
            <li>Call or text <a href="tel:510-313-3291" className="text-primary underline">(510) 313-3291</a></li>
            <li>Mail: eXp Realty, 6425 Living Pl #200, Pittsburgh, PA 15206</li>
          </ul>
          <p className="mt-3 text-sm text-charcoal-light">
            Please describe the accessibility barrier, assistive technology used (if applicable), and preferred format. We
            respond within two business days.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal">6. Continuous Improvement</h2>
        <p>
          Accessibility is an ongoing effort. We review new features with accessibility checks, train staff on inclusive
          design, and prioritize fixes identified through testing or user feedback. Suggestions are welcome via the contact
          channels above.
        </p>
      </div>
    </div>
  </section>
);

export default Accessibility;


import React from 'react';

export const Privacy: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Privacy Policy</h1>
      <p className="text-charcoal-light mb-8">Effective Date: {new Date().getFullYear()}-01-01</p>

      <div className="prose prose-lg max-w-none">
        <p>
          This Privacy Policy describes how we collect, use, and safeguard personal information
          in connection with our real estate services in Pittsburgh, Pennsylvania. We comply with the
          Real Estate Licensing and Registration Act (RELRA) and applicable U.S. privacy laws.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Contact information (name, email, phone) when you submit forms or chat with Nicole's Assistant.</li>
          <li>Inquiry details about properties, neighborhoods, and preferences.</li>
          <li>Site usage data (device/browser) for security and performance.</li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>To respond to inquiries, schedule showings, and provide real estate services.</li>
          <li>To connect you with our licensed agent and trusted service providers at your request.</li>
          <li>To maintain site security, prevent fraud, and comply with legal obligations.</li>
        </ul>

        <h2>Nicole's Assistant (AI) Disclosures</h2>
        <p>
          Nicole's Assistant is an AI-powered tool operating in a privacy-first environment. Conversations are not sent to
          external cloud services. The Assistant provides general information only, is not a licensed real estate professional,
          and cannot provide legal, tax, or financial advice. Substantive questions are referred to the licensed agent.
        </p>

        <h2>Sharing of Information</h2>
        <p>
          We do not sell personal information. We may share information with our brokerage, service vendors, and
          legal or regulatory authorities as required by law.
        </p>

        <h2>Your Choices</h2>
        <ul>
          <li>Opt out of marketing at any time by contacting us.</li>
          <li>Request access, correction, or deletion of your data where permitted by law.</li>
        </ul>

        <h2>Contact</h2>
        <p>
          eXp Realty — Pittsburgh, Pennsylvania. Contact: (412) 555-0199.
          Email: privacy@exprealty.com
        </p>
      </div>
    </div>
  </section>
);

export default Privacy;

